import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Page() {
    return (
        <div className="min-h-full grid grid-cols-1 lg:grid-cols-2">
            <div className="h-full flex-col lg:flex items-center">
                <div className="text-center space-y-4 pt-16">
                    <h1 className="font-bold text-3xl text-[#2E2A47]">
                        Welcome Back!
                    </h1>
                    <p className="text-base text-[#7E8CA0]">
                        Log in or Create account to get back to your dashboard!
                    </p>
                </div>
                <div className="flex items-center justify-center mt-8">
                    <ClerkLoading>
                        <Loader2 className="animate-spin text-muted-foreground" />
                    </ClerkLoading>

                    <ClerkLoaded>
                        <SignIn />
                    </ClerkLoaded>
                </div>
            </div>

            <div className="h-full bg-blue-600 hidden lg:flex items-center justify-center">
                <Image src="/logo.svg" alt="logo" width={100} height={100} />
            </div>
        </div>
    );
}