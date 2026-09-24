import { useEffect, useRef, useState } from "react";
import {
  KeyRound,
  QrCode,
  ArrowRight,
  ShieldCheck,
  ScanLine,
  X,
  Copy,
  Check,
  Clock3,
  FileText,
  Code2,
  Link as LinkIcon,
  Clipboard,
  LockKeyhole,
} from "lucide-react";

import {
  joinShare,
  verifySharePassword,
} from "../services/shareService";

function JoinShare() {
  const [code, setCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [share, setShare] = useState(null);

  const [requiresPassword, setRequiresPassword] =
    useState(false);

  const [password, setPassword] = useState("");

  const [passwordLoading, setPasswordLoading] =
    useState(false);

  const [copied, setCopied] = useState(false);

  const inputRefs = useRef([]);

  // ==========================================
  // Automatically Read Code From URL
  // Example:
  // /join?code=123456
  // ==========================================

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const urlCode = params
      .get("code")
      ?.replace(/\D/g, "")
      .slice(0, 6);

    if (urlCode) {
      const newCode = [
        "",
        "",
        "",
        "",
        "",
        "",
      ];

      urlCode
        .split("")
        .forEach((number, index) => {
          newCode[index] = number;
        });

      setCode(newCode);

      // Automatically access share
      if (urlCode.length === 6) {
        accessShare(urlCode);
      }
    }
  }, []);

  // ==========================================
  // Code Input
  // ==========================================

  const handleChange = (index, value) => {
    const number = value.replace(/\D/g, "");

    if (!number) {
      const newCode = [...code];
      newCode[index] = "";

      setCode(newCode);
      setError("");

      return;
    }

    const newCode = [...code];

    // Handle multiple pasted digits
    if (number.length > 1) {
      const numbers = number.split("");

      numbers.forEach((num, offset) => {
        if (index + offset < 6) {
          newCode[index + offset] = num;
        }
      });

      setCode(newCode);
      setError("");

      const nextIndex = Math.min(
        index + number.length,
        5
      );

      inputRefs.current[nextIndex]?.focus();

      return;
    }

    newCode[index] = number;

    setCode(newCode);
    setError("");

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ==========================================
  // Keyboard Navigation
  // ==========================================

  const handleKeyDown = (index, event) => {
    if (
      event.key === "Backspace" &&
      !code[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (
      event.key === "ArrowLeft" &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (
      event.key === "ArrowRight" &&
      index < 5
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ==========================================
  // Paste Code
  // ==========================================

  const handlePaste = (event) => {
    event.preventDefault();

    const pastedText = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedText) return;

    const newCode = [
      "",
      "",
      "",
      "",
      "",
      "",
    ];

    pastedText
      .split("")
      .forEach((number, index) => {
        newCode[index] = number;
      });

    setCode(newCode);
    setError("");

    const focusIndex = Math.min(
      pastedText.length,
      5
    );

    inputRefs.current[focusIndex]?.focus();

    // Automatically access if complete
    if (pastedText.length === 6) {
      accessShare(pastedText);
    }
  };

  // ==========================================
  // Access Share API
  // ==========================================

  const accessShare = async (shareCode) => {
    try {
      setIsLoading(true);
      setError("");

      const response =
        await joinShare(shareCode);

      if (!response.success) {
        setError(
          response.message ||
            "Failed to access share."
        );

        return;
      }

      // Password protected share
      if (response.requiresPassword) {
        setShare(response.share);
        setRequiresPassword(true);
        setPassword("");

        return;
      }

      // Normal share
      setShare(response.share);
      setRequiresPassword(false);
    } catch (error) {
      console.error(
        "Join share error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to access share. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // Submit Code
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const shareCode = code.join("");

    if (shareCode.length !== 6) {
      setError(
        "Please enter the complete 6-digit share code."
      );

      return;
    }

    await accessShare(shareCode);
  };

  // ==========================================
  // Verify Password
  // ==========================================

  const handlePasswordSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!password.trim()) {
      setError("Please enter the password.");
      return;
    }

    try {
      setPasswordLoading(true);
      setError("");

      const response =
        await verifySharePassword(
          share.shareCode,
          password
        );

      if (!response.success) {
        setError(
          response.message ||
            "Password verification failed."
        );

        return;
      }

      // Password correct
      setShare(response.share);
      setRequiresPassword(false);
      setPassword("");
    } catch (error) {
      console.error(
        "Password verification error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Incorrect password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // ==========================================
  // Copy Content
  // ==========================================

  const handleCopy = async () => {
    if (!share?.content) return;

    try {
      await navigator.clipboard.writeText(
        share.content
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Copy error:",
        error
      );
    }
  };

  // ==========================================
  // Clear Code
  // ==========================================

  const clearCode = () => {
    setCode([
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

    setError("");
    setShare(null);
    setRequiresPassword(false);
    setPassword("");
    setCopied(false);

    // Remove code from URL
    window.history.replaceState(
      {},
      "",
      "/join"
    );

    inputRefs.current[0]?.focus();
  };

  // ==========================================
  // Join Another Share
  // ==========================================

  const handleJoinAnother = () => {
    setCode([
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

    setShare(null);
    setRequiresPassword(false);
    setPassword("");
    setError("");
    setCopied(false);

    window.history.replaceState(
      {},
      "",
      "/join"
    );

    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  };

  // ==========================================
  // Share Content Screen
  // ==========================================

  if (share && !requiresPassword) {
    return (
      <ShareContent
        share={share}
        copied={copied}
        onCopy={handleCopy}
        onJoinAnother={handleJoinAnother}
      />
    );
  }

  // ==========================================
  // Password Screen
  // ==========================================

  if (requiresPassword) {
    return (
      <PasswordScreen
        share={share}
        password={password}
        setPassword={setPassword}
        error={error}
        setError={setError}
        isLoading={passwordLoading}
        onSubmit={handlePasswordSubmit}
        onBack={() => {
          setRequiresPassword(false);
          setShare(null);
          setPassword("");
          setError("");
        }}
      />
    );
  }

  // ==========================================
  // Join Page
  // ==========================================

  return (
    <main
      className="min-h-[calc(100vh-73px)] px-4 py-12 sm:px-6"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <div className="mx-auto max-w-3xl">

        {/* Header */}

        <div className="text-center">
          <div
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{
              backgroundColor:
                "rgb(var(--primary) / 0.12)",
              color:
                "rgb(var(--primary))",
            }}
          >
            <KeyRound size={30} />
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Join a Share
          </h1>

          <p
            className="mx-auto mt-3 max-w-lg text-sm sm:text-base"
            style={{
              color: "var(--muted)",
            }}
          >
            Enter the 6-digit code shared with you
            to access the temporary content.
          </p>
        </div>

        {/* Code Card */}

        <div
          className="mx-auto mt-10 max-w-xl rounded-3xl border p-6 shadow-sm sm:p-8"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface)",
          }}
        >
          <form onSubmit={handleSubmit}>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">
                  Share Code
                </h2>

                <p
                  className="mt-1 text-xs"
                  style={{
                    color: "var(--muted)",
                  }}
                >
                  Enter exactly 6 digits
                </p>
              </div>

              {code.some(Boolean) && (
                <button
                  type="button"
                  onClick={clearCode}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition hover:bg-red-500/10"
                  style={{
                    color: "var(--muted)",
                  }}
                >
                  <X size={14} />
                  Clear
                </button>
              )}
            </div>

            {/* Code Inputs */}

            <div className="mt-7 flex justify-center gap-2 sm:gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] =
                      element;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  disabled={isLoading}
                  onChange={(event) =>
                    handleChange(
                      index,
                      event.target.value
                    )
                  }
                  onKeyDown={(event) =>
                    handleKeyDown(
                      index,
                      event
                    )
                  }
                  onPaste={handlePaste}
                  className="h-14 w-11 rounded-xl border text-center text-xl font-bold outline-none transition focus:ring-2 disabled:opacity-60 sm:h-16 sm:w-14 sm:text-2xl"
                  style={{
                    borderColor: error
                      ? "#ef4444"
                      : "var(--border)",

                    backgroundColor:
                      "var(--bg)",

                    color: "var(--text)",

                    "--tw-ring-color":
                      "rgb(var(--primary) / 0.25)",
                  }}
                />
              ))}
            </div>

            {/* Error */}

            {error && (
              <p className="mt-4 text-center text-sm text-red-500">
                {error}
              </p>
            )}

            {/* Submit */}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 font-semibold text-white transition hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                backgroundColor:
                  "rgb(var(--primary))",
              }}
            >
              {isLoading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Checking Share...
                </>
              ) : (
                <>
                  Access Share
                  <ArrowRight size={19} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Divider */}

        <div className="mx-auto my-8 flex max-w-xl items-center gap-4">
          <div
            className="h-px flex-1"
            style={{
              backgroundColor:
                "var(--border)",
            }}
          />

          <span
            className="text-xs font-medium"
            style={{
              color: "var(--muted)",
            }}
          >
            OR
          </span>

          <div
            className="h-px flex-1"
            style={{
              backgroundColor:
                "var(--border)",
            }}
          />
        </div>

        {/* QR Card */}

        <div
          className="mx-auto max-w-xl rounded-3xl border p-6 sm:p-8"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--surface)",
          }}
        >
          <div className="flex flex-col items-center text-center">

            <div
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{
                backgroundColor:
                  "rgb(var(--primary) / 0.1)",
                color:
                  "rgb(var(--primary))",
              }}
            >
              <QrCode size={26} />
            </div>

            <h2 className="text-lg font-semibold">
              Scan QR Code
            </h2>

            <p
              className="mt-2 max-w-md text-sm"
              style={{
                color: "var(--muted)",
              }}
            >
              Have a Droply QR code? Scan it to
              instantly open the shared content.
            </p>

            <button
              type="button"
              onClick={() =>
                alert(
                  "QR scanner will be connected later."
                )
              }
              className="mt-5 flex items-center gap-2 rounded-xl border px-5 py-3 font-medium transition hover:opacity-80"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg)",
              }}
            >
              <ScanLine size={18} />
              Scan QR Code
            </button>
          </div>
        </div>

        {/* Security Info */}

        <div
          className="mx-auto mt-6 flex max-w-xl gap-3 rounded-2xl border p-4"
          style={{
            borderColor:
              "rgb(var(--primary) / 0.2)",
            backgroundColor:
              "rgb(var(--primary) / 0.06)",
          }}
        >
          <ShieldCheck
            size={21}
            className="mt-0.5 shrink-0"
            style={{
              color:
                "rgb(var(--primary))",
            }}
          />

          <div>
            <p className="text-sm font-semibold">
              Temporary & secure
            </p>

            <p
              className="mt-1 text-xs leading-5"
              style={{
                color: "var(--muted)",
              }}
            >
              Droply shares are temporary. Content
              can automatically disappear after its
              expiry time or after being accessed.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}

// ==========================================
// Password Screen
// ==========================================

function PasswordScreen({
  share,
  password,
  setPassword,
  error,
  setError,
  isLoading,
  onSubmit,
  onBack,
}) {
  return (
    <main
      className="min-h-[calc(100vh-73px)] px-4 py-12 sm:px-6"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <div className="mx-auto max-w-lg">

        <div
          className="rounded-3xl border p-6 shadow-sm sm:p-8"
          style={{
            borderColor: "var(--border)",
            backgroundColor:
              "var(--surface)",
          }}
        >

          {/* Header */}

          <div className="text-center">

            <div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{
                backgroundColor:
                  "rgb(var(--primary) / 0.12)",
                color:
                  "rgb(var(--primary))",
              }}
            >
              <LockKeyhole size={30} />
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              Password Required
            </h1>

            <p
              className="mt-2 text-sm"
              style={{
                color: "var(--muted)",
              }}
            >
              This share is protected by a password.
            </p>

            <p
              className="mt-3 text-xs"
              style={{
                color: "var(--muted)",
              }}
            >
              Share Code:{" "}
              <span
                className="font-semibold"
                style={{
                  color:
                    "rgb(var(--primary))",
                }}
              >
                {share?.shareCode}
              </span>
            </p>
          </div>

          {/* Form */}

          <form
            onSubmit={onSubmit}
            className="mt-7"
          >

            <label className="mb-2 block text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              value={password}
              autoFocus
              disabled={isLoading}
              onChange={(event) => {
                setPassword(
                  event.target.value
                );
                setError("");
              }}
              placeholder="Enter share password"
              className="w-full rounded-xl border px-4 py-3 outline-none disabled:opacity-60"
              style={{
                borderColor: error
                  ? "#ef4444"
                  : "var(--border)",
                backgroundColor:
                  "var(--bg)",
                color: "var(--text)",
              }}
            />

            {error && (
              <p className="mt-3 text-sm text-red-500">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                backgroundColor:
                  "rgb(var(--primary))",
              }}
            >
              {isLoading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify Password
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onBack}
              disabled={isLoading}
              className="mt-3 w-full rounded-xl border px-5 py-3 text-sm font-medium transition hover:opacity-80 disabled:opacity-50"
              style={{
                borderColor:
                  "var(--border)",
                backgroundColor:
                  "var(--bg)",
              }}
            >
              Back
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}

// ==========================================
// Share Content
// ==========================================

function ShareContent({
  share,
  copied,
  onCopy,
  onJoinAnother,
}) {
  const getTypeIcon = () => {
    switch (share.type) {
      case "code":
        return <Code2 size={26} />;

      case "link":
        return <LinkIcon size={26} />;

      case "clipboard":
        return <Clipboard size={26} />;

      case "secret":
        return <LockKeyhole size={26} />;

      default:
        return <FileText size={26} />;
    }
  };

  return (
    <main
      className="min-h-[calc(100vh-73px)] px-4 py-12 sm:px-6"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <div className="mx-auto max-w-3xl">

        <div
          className="rounded-3xl border p-6 shadow-sm sm:p-8"
          style={{
            borderColor: "var(--border)",
            backgroundColor:
              "var(--surface)",
          }}
        >

          {/* Header */}

          <div className="text-center">

            <div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{
                backgroundColor:
                  "rgb(var(--primary) / 0.12)",
                color:
                  "rgb(var(--primary))",
              }}
            >
              {getTypeIcon()}
            </div>

            <h1 className="mt-5 text-2xl font-bold sm:text-3xl">
              Share Accessed 🎉
            </h1>

            <p
              className="mt-2 text-sm"
              style={{
                color: "var(--muted)",
              }}
            >
              The shared content is available below.
            </p>
          </div>

          {/* Share Info */}

          <div
            className="mt-7 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--bg)",
            }}
          >

            <div>
              <p
                className="text-xs"
                style={{
                  color: "var(--muted)",
                }}
              >
                Share Code
              </p>

              <p
                className="mt-1 font-bold tracking-wider"
                style={{
                  color:
                    "rgb(var(--primary))",
                }}
              >
                {share.shareCode}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Clock3 size={15} />

              <span
                style={{
                  color: "var(--muted)",
                }}
              >
                Expires{" "}
                {new Date(
                  share.expiresAt
                ).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Content */}

          <div className="mt-6">

            {share.type === "link" ? (
              <a
                href={share.content}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl border p-5 break-all text-sm transition hover:opacity-80"
                style={{
                  borderColor:
                    "var(--border)",
                  backgroundColor:
                    "var(--bg)",
                  color:
                    "rgb(var(--primary))",
                }}
              >
                {share.content}
              </a>
            ) : share.type === "files" ? (
              <FileList
                files={share.files}
              />
            ) : (
              <div className="relative">

                <pre
                  className="max-h-[500px] overflow-auto whitespace-pre-wrap break-words rounded-2xl border p-5 text-sm leading-6"
                  style={{
                    borderColor:
                      "var(--border)",
                    backgroundColor:
                      "var(--bg)",
                    color:
                      "var(--text)",
                  }}
                >
                  {share.content}
                </pre>

                {share.content && (
                  <button
                    type="button"
                    onClick={onCopy}
                    className="absolute right-3 top-3 flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition hover:opacity-80"
                    style={{
                      borderColor:
                        "var(--border)",
                      backgroundColor:
                        "var(--surface)",
                    }}
                  >
                    {copied ? (
                      <>
                        <Check size={15} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={15} />
                        Copy
                      </>
                    )}
                  </button>
                )}

              </div>
            )}

          </div>

          {/* Language */}

          {share.type === "code" &&
            share.language && (
              <div
                className="mt-4 rounded-xl border p-3 text-xs"
                style={{
                  borderColor:
                    "var(--border)",
                  backgroundColor:
                    "var(--bg)",
                }}
              >
                Language:{" "}
                <span className="font-semibold">
                  {share.language}
                </span>
              </div>
            )}

          {/* Security */}

          <div
            className="mt-6 flex gap-3 rounded-2xl border p-4"
            style={{
              borderColor:
                "rgb(var(--primary) / 0.2)",
              backgroundColor:
                "rgb(var(--primary) / 0.06)",
            }}
          >
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0"
              style={{
                color:
                  "rgb(var(--primary))",
              }}
            />

            <div>
              <p className="text-sm font-semibold">
                Temporary share
              </p>

              <p
                className="mt-1 text-xs leading-5"
                style={{
                  color:
                    "var(--muted)",
                }}
              >
                This content is temporary and
                will automatically expire.
              </p>
            </div>
          </div>

          {/* Join Another */}

          <button
            type="button"
            onClick={onJoinAnother}
            className="mt-6 w-full rounded-xl border px-5 py-3.5 text-sm font-medium transition hover:opacity-80"
            style={{
              borderColor:
                "var(--border)",
              backgroundColor:
                "var(--bg)",
            }}
          >
            Join Another Share
          </button>

        </div>
      </div>
    </main>
  );
}

// ==========================================
// File List
// ==========================================

function FileList({ files = [] }) {
  if (!files.length) {
    return (
      <div
        className="rounded-2xl border p-6 text-center"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg)",
        }}
      >
        <FileText
          size={30}
          className="mx-auto"
          style={{
            color:
              "rgb(var(--primary))",
          }}
        />

        <p className="mt-3 text-sm font-medium">
          No files available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {files.map((file, index) => (
        <div
          key={`${file.name}-${index}`}
          className="flex items-center gap-3 rounded-2xl border p-4"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg)",
          }}
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{
              backgroundColor:
                "rgb(var(--primary) / 0.1)",
              color:
                "rgb(var(--primary))",
            }}
          >
            <FileText size={19} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {file.originalName ||
                file.name ||
                "File"}
            </p>

            {file.size && (
              <p
                className="mt-1 text-xs"
                style={{
                  color: "var(--muted)",
                }}
              >
                {formatFileSize(file.size)}
              </p>
            )}
          </div>

          {file.url && (
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl px-4 py-2 text-xs font-semibold text-white"
              style={{
                backgroundColor:
                  "rgb(var(--primary))",
              }}
            >
              Open
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

// ==========================================
// Format File Size
// ==========================================

function formatFileSize(bytes) {
  if (!bytes) return "0 Bytes";

  const sizes = [
    "Bytes",
    "KB",
    "MB",
    "GB",
  ];

  const index = Math.floor(
    Math.log(bytes) / Math.log(1024)
  );

  return `${(
    bytes /
    Math.pow(1024, index)
  ).toFixed(2)} ${sizes[index]}`;
}

export default JoinShare;