// import DirectMessages from "@/components/directmessage/directtmessage";

import DirectMessages from "@/app/components/directmessage/directmessage";

export const metadata = {
  title: "Direct messages",
};

export default function MessagesPage() {
  return (
    <main
    //   style={{
    //     minHeight: "100vh",
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "center",
    //     padding: "24px",
    //     background: "#f8fafc",
    //   }}
    >
      <DirectMessages />
    </main>
  );
}