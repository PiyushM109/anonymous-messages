"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function page() {
  const [messages, setMessages] = useState<Message[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages?.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
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
      toast(
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
          toast("Showing latest messages");
        }
      } catch (error) {
        console.log(error);
        const axiosError = error as AxiosError<ApiResponse>;
        toast(
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
      toast(response.data.message);
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast(
        axiosError?.response?.data?.message || "Failed to fetch the messages"
      );
    }
  };
  console.log({ session });
  const { username } = session?.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast("url copied successfully");
  };
  if (!session || !session.user) {
    return <div> Please login</div>;
  }
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 rounded w-full mx-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-boarder w-full p-2 mr-2"
          />
          <Button onClick={copyToClipBoard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages : {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 e-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {messages && messages?.length > 0 ? (
          messages?.map((message, index) => (
            <MessageCard
              key={index}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No Message to display</p>
        )}
      </div>
    </div>
  );
}

export default page;
