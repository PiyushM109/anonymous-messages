"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Message } from "@/model/User";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import {
  Loader2,
  RefreshCcw,
  Copy,
  Link2,
  MessageSquare,
  Bell,
  BellOff,
} from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages?.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
    defaultValues: {
      acceptMessages: false, // Add default value here
    },
  });
  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAccetMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-message");
      const isAccepting = response?.data?.isAcceptingMessage || false;
      setValue("acceptMessages", isAccepting);
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError?.response?.data?.message ||
          "Failed to fetch the message settings"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        console.log({ response });
        setMessages(response.data.messages || []);
        if (refresh) {
          toast.success("Showing latest messages");
        }
      } catch (error) {
        console.log(error);
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError?.response?.data?.message || "Failed to fetch the messages"
        );
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) {
      return;
    }
    fetchMessages();
    fetchAccetMessage();
  }, [session, setValue, fetchAccetMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-message", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError?.response?.data?.message || "Failed to update settings"
      );
    }
  };

  if (!session || !session.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground">
              Please login to access your dashboard
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { username } = session?.user as User;
  const profileUrl = `http://localhost:3000/u/${username}`;

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("URL copied to clipboard");
  };

  return (
    <div className="min-h-screen py-8 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Manage your anonymous messages and settings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Share Link Card */}
          <Card className="border-2 hover:border-foreground/50 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                  <Link2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Your Unique Link</h3>
                  <p className="text-sm text-muted-foreground">
                    Share this to receive messages
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={profileUrl}
                  disabled
                  className="flex-1 px-4 py-3 border rounded-lg bg-background/50 text-sm font-mono"
                />
                <Button
                  onClick={copyToClipBoard}
                  className="px-6 hover:scale-105 transition-transform"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Message Settings Card */}
          <Card className="border-2 hover:border-foreground/50 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                  {acceptMessages ? (
                    <Bell className="w-5 h-5" />
                  ) : (
                    <BellOff className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Message Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Control who can message you
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg bg-background/50">
                <div className="flex items-center gap-3">
                  <Switch
                    {...register("acceptMessages")}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                  />
                  <div>
                    <p className="font-medium">Accept Messages</p>
                    <p className="text-sm text-muted-foreground">
                      {acceptMessages
                        ? "Currently accepting"
                        : "Currently not accepting"}
                    </p>
                  </div>
                </div>
                {isSwitchLoading && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* Messages Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-1">
                Your Messages
              </h2>
              <p className="text-muted-foreground">
                {messages && messages.length > 0
                  ? `${messages.length} message${messages.length !== 1 ? "s" : ""}`
                  : "No messages yet"}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                fetchMessages(true);
              }}
              disabled={isLoading}
              className="hover:border-foreground transition-colors"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCcw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>

          {/* Messages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {messages && messages?.length > 0 ? (
              messages?.map((message, index) => (
                <MessageCard
                  key={index}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))
            ) : (
              <Card className="col-span-full border-2 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <MessageSquare className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No Messages Yet
                  </h3>
                  <p className="text-muted-foreground text-center max-w-sm">
                    Share your unique link to start receiving anonymous messages
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
