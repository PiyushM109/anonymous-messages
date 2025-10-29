"use client";
import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  MessageSquare,
  Lock,
  Zap,
  Eye,
  Shield,
  ArrowRight,
} from "lucide-react";

// Sample messages data
const messages = [
  {
    title: "Anonymous Feedback",
    content: "Your work inspires me every day!",
    received: "2 hours ago",
  },
  {
    title: "Secret Admirer",
    content: "I think you're amazing",
    received: "5 hours ago",
  },
  {
    title: "Honest Opinion",
    content: "You should pursue that dream",
    received: "1 day ago",
  },
];

const features = [
  {
    icon: Lock,
    title: "Complete Privacy",
    description:
      "Your identity is never revealed. Send and receive messages with full anonymity.",
  },
  {
    icon: Zap,
    title: "Instant Delivery",
    description: "Messages are delivered immediately. No waiting, no delays.",
  },
  {
    icon: Eye,
    title: "No Tracking",
    description: "We don't track, store, or monitor your conversations. Ever.",
  },
];

const Page = () => {
  return (
    <main className="relative flex flex-col items-center px-4 md:px-8 py-16 min-h-screen">
      {/* Hero Section */}
      <section className="text-center max-w-5xl mb-24 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-foreground/20 mb-8">
          <Shield className="w-4 h-4" />
          <span className="text-sm font-medium">Anonymous & Secure</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight">
          Speak Freely.
          <br />
          Stay Anonymous.
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
          Share your thoughts, give honest feedback, or confess your feelings
          without revealing who you are.
        </p>

        <button className="group px-10 py-5 bg-foreground text-background rounded-full font-semibold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-3">
          Get Started Now
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </section>

      {/* Features Grid */}
      <section className="w-full max-w-6xl mb-24 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Why Choose Anonymous Messages?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-2 hover:border-foreground transition-all duration-300 bg-background/50 backdrop-blur-sm"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Messages Showcase */}
      <section className="w-full max-w-6xl mb-24 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Real Anonymous Messages
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {messages.map((message, index) => (
            <Card
              key={index}
              className="border hover:border-foreground/50 transition-all duration-300 hover:shadow-xl bg-background/80 backdrop-blur-sm group"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <MessageSquare className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-xs text-muted-foreground">
                    {message.received}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  {message.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium leading-relaxed">
                  "{message.content}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center max-w-4xl relative z-10">
        <div className="border-2 border-foreground/20 rounded-3xl p-12 md:p-16 bg-background/50 backdrop-blur-sm">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Start?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands who trust us for anonymous communication. No sign-up
            required.
          </p>
          <button className="px-10 py-5 bg-foreground text-background rounded-full font-semibold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
            Create Your Link
          </button>
        </div>
      </section>

      {/* Background Elements */}
      <div className="absolute top-40 left-20 w-96 h-96 bg-foreground/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-40 right-20 w-96 h-96 bg-foreground/5 rounded-full blur-3xl -z-10" />
    </main>
  );
};

export default Page;
