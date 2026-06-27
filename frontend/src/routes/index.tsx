import { createFileRoute } from "@tanstack/react-router";
import Landing from "@/components/Landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SecureNet AI — AI Powered Phishing Detection" },
      { name: "description", content: "SecureNet AI analyzes website security using Machine Learning and Network Security intelligence to detect phishing in real time." },
      { property: "og:title", content: "SecureNet AI — AI Powered Phishing Detection" },
      { property: "og:description", content: "Detect phishing websites with ML, MLOps and cybersecurity intelligence." },
    ],
  }),
  component: Landing,
});
