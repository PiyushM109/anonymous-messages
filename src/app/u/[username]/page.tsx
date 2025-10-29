"use client";

import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/apiResponse";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

function SendMessagePage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAcceptingMessages, setIsCheckingAcceptingMessages] =
    useState(true);
  const [isAcceptingMessages, setIsAcceptingMessages] = useState(false);

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
  });

  form.watch("content");

  const fetchAcceptingMessagesStatus = useCallback(async () => {
    setIsCheckingAcceptingMessages(true);
    try {
      const response = await axios.get<ApiResponse>(
        `/api/check-user-accepting-messages?username=${username}`
      );
      const res = response.data.isAcceptingMessage || false;
      setIsAcceptingMessages(res);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(
        axiosError.response?.data?.message ??
          "Failed to fetch user message acceptance status."
      );
      setIsAcceptingMessages(false); // Assume not accepting on error
    } finally {
      setIsCheckingAcceptingMessages(false);
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      fetchAcceptingMessagesStatus();
    }
  }, [username, fetchAcceptingMessagesStatus]);

  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });

      toast(response.data.message);
      form.reset({ content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError.response?.data?.message ?? "Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingAcceptingMessages) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }
  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="w-full max-w-md p-8 space-y-8 bg-card text-card-foreground rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-6">
            Send Message to {username}
          </h1>
          <p className="mb-4">Send anonymous message to {username}</p>
        </div>
        {!isAcceptingMessages ? (
          <div className="text-center text-red-500">
            <p>{username} is not accepting messages at the moment.</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your anonymous message here"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}

export default SendMessagePage;
