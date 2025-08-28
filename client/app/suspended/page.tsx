import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Navbar } from "@/components/layout/navbar";

export default function SuspendedPage() {
  return (
    <AuthGuard allowedRoles={["tenant", "landlord", "admin"]}>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Navbar />
              <div className="flex flex-1 items-center justify-center px-4">
                <Card className="w-full max-w-lg mx-auto p-8 shadow-lg rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-red-600 text-center text-2xl font-bold mb-2">
                      Account Suspended
                    </CardTitle>
                    <CardDescription className="text-gray-700 text-base leading-relaxed max-w-md mx-auto text-center">
                      Your account has been suspended. Please contact support for assistance.{" "}
                      <a
                        href="mailto:olusolasolataofeek@gmail.com"
                        className="text-blue-600 hover:underline font-medium"
                      >
                                  Reach out at olusolataofeek@gmail.com
                      </a>
                      .
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
      </AuthGuard>
  );
}