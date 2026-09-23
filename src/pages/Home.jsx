import {
  ArrowRight,
  FileUp,
  Lock,
  Zap,
  Clock3,
  ShieldCheck,
  QrCode,
  Clipboard,
  Code2,
  Link as LinkIcon,
} from "lucide-react";

import { Link } from "react-router-dom";

function Home() {
  return (
    <main
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
      }}
    >
      {/* ================= HERO ================= */}

      <section className="px-6 pb-20 pt-20 md:pt-28">

        <div className="mx-auto max-w-6xl text-center">

          {/* Badge */}

          <div
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
              color: "var(--muted)",
            }}
          >
            <Zap
              size={16}
              style={{
                color: "rgb(var(--primary))",
              }}
            />

            Fast • Private • Temporary
          </div>

          {/* Heading */}

          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">

            Drop anything.

            <br />

            <span
              style={{
                color: "rgb(var(--primary))",
              }}
            >
              Share anywhere.
            </span>

          </h1>

          {/* Description */}

          <p
            className="mx-auto mt-7 max-w-2xl text-lg leading-8 md:text-xl"
            style={{
              color: "var(--muted)",
            }}
          >
            Share files, text, code and links instantly.
            No complicated setup. No unnecessary accounts.
          </p>

          {/* Buttons */}

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">

            <Link
              to="/create"
              className="flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-white transition hover:opacity-90"
              style={{
                backgroundColor: "rgb(var(--primary))",
              }}
            >
              Create Share

              <ArrowRight size={19} />
            </Link>

            <Link
              to="/join"
              className="rounded-xl border px-6 py-3.5 font-semibold transition hover:opacity-80"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--surface)",
              }}
            >
              Join with Code
            </Link>

          </div>

        </div>

      </section>

      {/* ================= SHARE BOX ================= */}

      <section className="px-6 pb-24">

        <div className="mx-auto max-w-4xl">

          <div
            className="rounded-3xl border p-6 shadow-sm md:p-10"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
            }}
          >

            <div
              className="rounded-2xl border-2 border-dashed p-10 text-center md:p-16"
              style={{
                borderColor: "var(--border)",
              }}
            >

              <div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor:
                    "rgb(var(--primary) / 0.12)",
                  color: "rgb(var(--primary))",
                }}
              >
                <FileUp size={32} />
              </div>

              <h2 className="mt-6 text-2xl font-bold">
                Drop your files here
              </h2>

              <p
                className="mt-2"
                style={{
                  color: "var(--muted)",
                }}
              >
                Drag & drop files or select them from your device.
              </p>

              <button
                className="mt-6 rounded-xl px-6 py-3 font-semibold text-white"
                style={{
                  backgroundColor: "rgb(var(--primary))",
                }}
              >
                Select Files
              </button>

              <p
                className="mt-4 text-sm"
                style={{
                  color: "var(--muted)",
                }}
              >
                Files will be added when you create a share.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ================= CONTENT TYPES ================= */}

      <section className="px-6 py-20">

        <div className="mx-auto max-w-6xl">

          <div className="text-center">

            <p
              className="font-semibold"
              style={{
                color: "rgb(var(--primary))",
              }}
            >
              ONE PLATFORM
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Share more than files.
            </h2>

            <p
              className="mx-auto mt-4 max-w-2xl"
              style={{
                color: "var(--muted)",
              }}
            >
              Droply lets you share different types of content
              from one simple interface.
            </p>

          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <FeatureCard
              icon={<FileUp size={25} />}
              title="Files"
              description="Share PDFs, images, videos, ZIPs and more."
            />

            <FeatureCard
              icon={<Clipboard size={25} />}
              title="Text"
              description="Move notes and clipboard content between devices."
            />

            <FeatureCard
              icon={<Code2 size={25} />}
              title="Code"
              description="Share code snippets with developers instantly."
            />

            <FeatureCard
              icon={<LinkIcon size={25} />}
              title="Links"
              description="Send URLs without typing them again."
            />

          </div>

        </div>

      </section>

      {/* ================= FEATURES ================= */}

      <section className="px-6 py-20">

        <div className="mx-auto max-w-6xl">

          <div className="text-center">

            <p
              className="font-semibold"
              style={{
                color: "rgb(var(--primary))",
              }}
            >
              BUILT FOR SPEED
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Simple, fast and private.
            </h2>

          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            <FeatureCard
              icon={<QrCode size={25} />}
              title="QR & Share Code"
              description="Generate a short access code and QR code for every share."
            />

            <FeatureCard
              icon={<Clock3 size={25} />}
              title="Auto Expiry"
              description="Temporary shares automatically disappear after their lifetime."
            />

            <FeatureCard
              icon={<ShieldCheck size={25} />}
              title="Privacy First"
              description="Share only what you need and keep temporary data short-lived."
            />

          </div>

        </div>

      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section className="px-6 py-20">

        <div className="mx-auto max-w-6xl">

          <div className="text-center">

            <p
              className="font-semibold"
              style={{
                color: "rgb(var(--primary))",
              }}
            >
              HOW IT WORKS
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Three simple steps.
            </h2>

          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            <Step
              number="01"
              title="Create a Share"
              description="Add your files, text, code or links."
            />

            <Step
              number="02"
              title="Share the Code"
              description="Send the 6-digit code, link or QR code."
            />

            <Step
              number="03"
              title="Receive"
              description="The receiver opens the share and downloads or copies the content."
            />

          </div>

        </div>

      </section>

      {/* ================= SECURITY ================= */}

      <section className="px-6 py-20">

        <div
          className="mx-auto max-w-6xl rounded-3xl border p-8 md:p-12"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface)",
          }}
        >

          <div className="grid items-center gap-10 md:grid-cols-2">

            <div>

              <div
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  backgroundColor:
                    "rgb(var(--primary) / 0.12)",
                  color: "rgb(var(--primary))",
                }}
              >
                <Lock size={24} />
              </div>

              <h2 className="text-3xl font-bold">
                Your shares don't need to live forever.
              </h2>

              <p
                className="mt-5 leading-7"
                style={{
                  color: "var(--muted)",
                }}
              >
                Droply is designed around temporary sharing.
                Shares can have an expiration time and can
                optionally be configured for one-time access.
              </p>

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <SecurityItem
                title="Temporary"
                description="Automatic expiration"
              />

              <SecurityItem
                title="Protected"
                description="Optional password"
              />

              <SecurityItem
                title="One-Time"
                description="Burn after reading"
              />

              <SecurityItem
                title="Rate Limited"
                description="Abuse protection"
              />

            </div>

          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}

      <section className="px-6 py-24">

        <div className="mx-auto max-w-4xl text-center">

          <h2 className="text-4xl font-bold md:text-5xl">
            Ready to share?
          </h2>

          <p
            className="mx-auto mt-5 max-w-xl"
            style={{
              color: "var(--muted)",
            }}
          >
            Create a temporary share and send it to anyone,
            anywhere.
          </p>

          <Link
            to="/create"
            className="mt-8 inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-semibold text-white"
            style={{
              backgroundColor: "rgb(var(--primary))",
            }}
          >
            Create Share

            <ArrowRight size={19} />
          </Link>

        </div>

      </section>

    </main>
  );
}

/* ================= COMPONENTS ================= */

function FeatureCard({
  icon,
  title,
  description,
}) {
  return (
    <div
      className="rounded-2xl border p-6 transition hover:-translate-y-1"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--surface)",
      }}
    >
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl"
        style={{
          backgroundColor:
            "rgb(var(--primary) / 0.12)",
          color: "rgb(var(--primary))",
        }}
      >
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-semibold">
        {title}
      </h3>

      <p
        className="mt-2 text-sm leading-6"
        style={{
          color: "var(--muted)",
        }}
      >
        {description}
      </p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}) {
  return (
    <div
      className="rounded-2xl border p-7"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--surface)",
      }}
    >
      <span
        className="text-sm font-bold"
        style={{
          color: "rgb(var(--primary))",
        }}
      >
        {number}
      </span>

      <h3 className="mt-4 text-xl font-semibold">
        {title}
      </h3>

      <p
        className="mt-2 leading-6"
        style={{
          color: "var(--muted)",
        }}
      >
        {description}
      </p>
    </div>
  );
}

function SecurityItem({
  title,
  description,
}) {
  return (
    <div
      className="rounded-xl border p-5"
      style={{
        borderColor: "var(--border)",
      }}
    >
      <h3 className="font-semibold">
        {title}
      </h3>

      <p
        className="mt-1 text-sm"
        style={{
          color: "var(--muted)",
        }}
      >
        {description}
      </p>
    </div>
  );
}

export default Home;