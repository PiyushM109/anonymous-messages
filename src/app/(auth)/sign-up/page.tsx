"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceValue, useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function page() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const debounced = useDebounceCallback(setUsername, 500);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnque = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          console.log({ error });
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ??
              "Error checking username avialability"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnque();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      if (response.data.success) {
        toast(response.data.message);
      }
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError.response?.data.message ?? "Error submetrting form");
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
        <div className="text-center ">
          <h1 className="text-2xl font-bold tracking-tight mb-6">
            Join Anonymous Message
          </h1>
          <p className="mb-4">Signup to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  <p
                    className={`text-sm ${usernameMessage === "Username available" ? "text-green-500" : "text-red-500"}`}
                  >
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "SignUp"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{" "}
            <Link href="/sign-in" className="text-primary hover:text-blue-800">
              SignIn
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default page;
