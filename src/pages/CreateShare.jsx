import { useRef, useState } from "react";
import {
  File,
  FileText,
  Code2,
  Link as LinkIcon,
  Clipboard,
  LockKeyhole,
  Upload,
  X,
  Clock3,
  ShieldCheck,
  EyeOff,
} from "lucide-react";

const shareTypes = [
  {
    id: "files",
    name: "Files",
    icon: File,
    description: "Share images, videos, documents & more",
  },
  {
    id: "text",
    name: "Text",
    icon: FileText,
    description: "Share notes, messages or plain text",
  },
  {
    id: "code",
    name: "Code",
    icon: Code2,
    description: "Share code snippets with formatting",
  },
  {
    id: "link",
    name: "Link",
    icon: LinkIcon,
    description: "Share a website or URL",
  },
  {
    id: "clipboard",
    name: "Clipboard",
    icon: Clipboard,
    description: "Share copied content instantly",
  },
  {
    id: "secret",
    name: "Secret",
    icon: LockKeyhole,
    description: "Share sensitive information",
  },
];

const expiryOptions = [
  { value: "5m", label: "5 minutes" },
  { value: "10m", label: "10 minutes" },
  { value: "30m", label: "30 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "6h", label: "6 hours" },
  { value: "24h", label: "24 hours" },
];

function CreateShare() {
  const [shareType, setShareType] = useState("files");

  const [files, setFiles] = useState([]);

  const [text, setText] = useState("");

  const [code, setCode] = useState("");

  const [language, setLanguage] = useState("javascript");

  const [link, setLink] = useState("");

  const [clipboard, setClipboard] = useState("");

  const [secret, setSecret] = useState("");

  const [expiry, setExpiry] = useState("10m");

  const [passwordEnabled, setPasswordEnabled] = useState(false);

  const [password, setPassword] = useState("");

  const [burnAfterReading, setBurnAfterReading] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    setFiles((previousFiles) => [
      ...previousFiles,
      ...selectedFiles,
    ]);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const droppedFiles = Array.from(event.dataTransfer.files || []);

    setFiles((previousFiles) => [
      ...previousFiles,
      ...droppedFiles,
    ]);
  };

  const removeFile = (indexToRemove) => {
    setFiles((previousFiles) =>
      previousFiles.filter(
        (_, index) => index !== indexToRemove
      )
    );
  };

  const getFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";

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
      bytes / Math.pow(1024, index)
    ).toFixed(2)} ${sizes[index]}`;
  };

  const getCurrentContent = () => {
    switch (shareType) {
      case "text":
        return text;

      case "code":
        return code;

      case "link":
        return link;

      case "clipboard":
        return clipboard;

      case "secret":
        return secret;

      default:
        return "";
    }
  };

  const handleCreateShare = (event) => {
    event.preventDefault();

    const content = getCurrentContent();

    if (shareType === "files" && files.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    if (shareType !== "files" && !content.trim()) {
      alert("Please enter some content.");
      return;
    }

    if (passwordEnabled && !password.trim()) {
      alert("Please enter a password.");
      return;
    }

    /*
      Backend will be connected here later.

      For now we are only checking
      whether the form contains valid data.
    */

    alert(
      "Share creation API will be connected in the backend step."
    );
  };

  return (
    <main
      className="min-h-[calc(100vh-73px)] px-4 py-10 sm:px-6 lg:py-14"
      style={{
        backgroundColor: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}

        <div className="mb-10 text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{
              backgroundColor:
                "rgb(var(--primary) / 0.12)",
              color: "rgb(var(--primary))",
            }}
          >
            <Upload size={26} />
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Create a Share
          </h1>

          <p
            className="mx-auto mt-3 max-w-2xl text-sm sm:text-base"
            style={{
              color: "var(--muted)",
            }}
          >
            Choose what you want to share and create a
            temporary secure share.
          </p>
        </div>

        <form onSubmit={handleCreateShare}>
          {/* Share Type */}

          <section
            className="rounded-3xl border p-5 shadow-sm sm:p-6"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
            }}
          >
            <div className="mb-5">
              <h2 className="text-lg font-semibold">
                What do you want to share?
              </h2>

              <p
                className="mt-1 text-sm"
                style={{
                  color: "var(--muted)",
                }}
              >
                Select one sharing type.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {shareTypes.map((type) => {
                const Icon = type.icon;

                const active =
                  shareType === type.id;

                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() =>
                      setShareType(type.id)
                    }
                    className="rounded-2xl border p-4 text-left transition hover:-translate-y-0.5"
                    style={{
                      borderColor: active
                        ? "rgb(var(--primary))"
                        : "var(--border)",

                      backgroundColor: active
                        ? "rgb(var(--primary) / 0.08)"
                        : "var(--bg)",
                    }}
                  >
                    <div
                      className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: active
                          ? "rgb(var(--primary) / 0.15)"
                          : "var(--surface)",

                        color: active
                          ? "rgb(var(--primary))"
                          : "var(--muted)",
                      }}
                    >
                      <Icon size={20} />
                    </div>

                    <h3 className="font-semibold">
                      {type.name}
                    </h3>

                    <p
                      className="mt-1 text-xs leading-5"
                      style={{
                        color: "var(--muted)",
                      }}
                    >
                      {type.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Content Section */}

          <section
            className="mt-6 rounded-3xl border p-5 shadow-sm sm:p-6"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
            }}
          >
            {/* FILES */}

            {shareType === "files" && (
              <div>
                <div className="mb-5">
                  <h2 className="text-lg font-semibold">
                    Select files
                  </h2>

                  <p
                    className="mt-1 text-sm"
                    style={{
                      color: "var(--muted)",
                    }}
                  >
                    Drag and drop files or select them
                    from your device.
                  </p>
                </div>

                <div
                  onDragOver={(event) =>
                    event.preventDefault()
                  }
                  onDrop={handleDrop}
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition hover:opacity-80"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--bg)",
                  }}
                >
                  <div
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{
                      backgroundColor:
                        "rgb(var(--primary) / 0.1)",
                      color: "rgb(var(--primary))",
                    }}
                  >
                    <Upload size={25} />
                  </div>

                  <p className="font-semibold">
                    Drop files here
                  </p>

                  <p
                    className="mt-1 text-sm"
                    style={{
                      color: "var(--muted)",
                    }}
                  >
                    or click to browse
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                {/* Selected Files */}

                {files.length > 0 && (
                  <div className="mt-5 space-y-3">
                    {files.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center gap-3 rounded-2xl border p-3"
                        style={{
                          borderColor:
                            "var(--border)",
                          backgroundColor:
                            "var(--bg)",
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
                          <File size={19} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {file.name}
                          </p>

                          <p
                            className="text-xs"
                            style={{
                              color:
                                "var(--muted)",
                            }}
                          >
                            {getFileSize(file.size)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeFile(index)
                          }
                          className="rounded-lg p-2 transition hover:bg-red-500/10"
                          style={{
                            color: "var(--muted)",
                          }}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TEXT */}

            {shareType === "text" && (
              <ContentTextarea
                title="Your text"
                placeholder="Write anything you want to share..."
                value={text}
                onChange={setText}
              />
            )}

            {/* CODE */}

            {shareType === "code" && (
              <div>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Code snippet
                    </h2>

                    <p
                      className="mt-1 text-sm"
                      style={{
                        color: "var(--muted)",
                      }}
                    >
                      Share code with a selected
                      language.
                    </p>
                  </div>

                  <select
                    value={language}
                    onChange={(event) =>
                      setLanguage(event.target.value)
                    }
                    className="rounded-xl border px-4 py-2.5 text-sm outline-none"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: "var(--bg)",
                      color: "var(--text)",
                    }}
                  >
                    <option value="javascript">
                      JavaScript
                    </option>

                    <option value="typescript">
                      TypeScript
                    </option>

                    <option value="python">
                      Python
                    </option>

                    <option value="java">
                      Java
                    </option>

                    <option value="cpp">
                      C++
                    </option>

                    <option value="c">
                      C
                    </option>

                    <option value="html">
                      HTML
                    </option>

                    <option value="css">
                      CSS
                    </option>

                    <option value="json">
                      JSON
                    </option>

                    <option value="sql">
                      SQL
                    </option>
                  </select>
                </div>

                <textarea
                  value={code}
                  onChange={(event) =>
                    setCode(event.target.value)
                  }
                  placeholder="// Write your code here..."
                  rows={15}
                  className="w-full resize-y rounded-2xl border p-4 font-mono text-sm outline-none"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--bg)",
                    color: "var(--text)",
                  }}
                />
              </div>
            )}

            {/* LINK */}

            {shareType === "link" && (
              <div>
                <div className="mb-5">
                  <h2 className="text-lg font-semibold">
                    Share a link
                  </h2>

                  <p
                    className="mt-1 text-sm"
                    style={{
                      color: "var(--muted)",
                    }}
                  >
                    Paste any website URL.
                  </p>
                </div>

                <div className="relative">
                  <LinkIcon
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{
                      color: "var(--muted)",
                    }}
                  />

                  <input
                    type="url"
                    value={link}
                    onChange={(event) =>
                      setLink(event.target.value)
                    }
                    placeholder="https://example.com"
                    className="w-full rounded-2xl border py-4 pl-12 pr-4 outline-none"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: "var(--bg)",
                      color: "var(--text)",
                    }}
                  />
                </div>
              </div>
            )}

            {/* CLIPBOARD */}

            {shareType === "clipboard" && (
              <ContentTextarea
                title="Clipboard content"
                placeholder="Paste your copied content here..."
                value={clipboard}
                onChange={setClipboard}
              />
            )}

            {/* SECRET */}

            {shareType === "secret" && (
              <ContentTextarea
                title="Secret"
                placeholder="Enter the sensitive information you want to share..."
                value={secret}
                onChange={setSecret}
                secret
              />
            )}
          </section>

          {/* OPTIONS */}

          <section
            className="mt-6 rounded-3xl border p-5 shadow-sm sm:p-6"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
            }}
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold">
                Share options
              </h2>

              <p
                className="mt-1 text-sm"
                style={{
                  color: "var(--muted)",
                }}
              >
                Control how long and how securely your
                share remains available.
              </p>
            </div>

            {/* Expiry */}

            <div className="mb-5">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Clock3 size={17} />
                Expire after
              </label>

              <select
                value={expiry}
                onChange={(event) =>
                  setExpiry(event.target.value)
                }
                className="w-full rounded-xl border px-4 py-3 outline-none sm:max-w-sm"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--bg)",
                  color: "var(--text)",
                }}
              >
                {expiryOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}

            <div
              className="rounded-2xl border p-4"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg)",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor:
                      "rgb(var(--primary) / 0.1)",
                    color:
                      "rgb(var(--primary))",
                  }}
                >
                  <LockKeyhole size={19} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">
                        Password protection
                      </p>

                      <p
                        className="mt-1 text-xs"
                        style={{
                          color: "var(--muted)",
                        }}
                      >
                        Require a password before
                        accessing this share.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setPasswordEnabled(
                          !passwordEnabled
                        )
                      }
                      className="relative h-6 w-11 rounded-full transition"
                      style={{
                        backgroundColor:
                          passwordEnabled
                            ? "rgb(var(--primary))"
                            : "var(--border)",
                      }}
                    >
                      <span
                        className="absolute top-1 h-4 w-4 rounded-full bg-white transition"
                        style={{
                          left: passwordEnabled
                            ? "24px"
                            : "4px",
                        }}
                      />
                    </button>
                  </div>

                  {passwordEnabled && (
                    <input
                      type="password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter password"
                      className="mt-4 w-full rounded-xl border px-4 py-3 outline-none"
                      style={{
                        borderColor: "var(--border)",
                        backgroundColor:
                          "var(--surface)",
                        color: "var(--text)",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Burn after reading */}

            <div
              className="mt-4 flex items-center gap-3 rounded-2xl border p-4"
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
                  color: "rgb(var(--primary))",
                }}
              >
                <EyeOff size={19} />
              </div>

              <div className="flex-1">
                <p className="font-medium">
                  Burn after reading
                </p>

                <p
                  className="mt-1 text-xs"
                  style={{
                    color: "var(--muted)",
                  }}
                >
                  Delete this share automatically after
                  it is accessed once.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setBurnAfterReading(
                    !burnAfterReading
                  )
                }
                className="relative h-6 w-11 rounded-full transition"
                style={{
                  backgroundColor:
                    burnAfterReading
                      ? "rgb(var(--primary))"
                      : "var(--border)",
                }}
              >
                <span
                  className="absolute top-1 h-4 w-4 rounded-full bg-white transition"
                  style={{
                    left: burnAfterReading
                      ? "24px"
                      : "4px",
                  }}
                />
              </button>
            </div>
          </section>

          {/* Security info */}

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
              size={21}
              className="mt-0.5 shrink-0"
              style={{
                color: "rgb(var(--primary))",
              }}
            />

            <div>
              <p className="font-medium">
                Temporary & private
              </p>

              <p
                className="mt-1 text-sm"
                style={{
                  color: "var(--muted)",
                }}
              >
                Your share will automatically expire
                according to the selected settings.
              </p>
            </div>
          </div>

          {/* Create button */}

          <button
            type="submit"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold text-white transition hover:opacity-90 active:scale-[0.99]"
            style={{
              backgroundColor:
                "rgb(var(--primary))",
            }}
          >
            <Upload size={20} />
            Create Share
          </button>
        </form>
      </div>
    </main>
  );
}

function ContentTextarea({
  title,
  placeholder,
  value,
  onChange,
  secret = false,
}) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          {title}
        </h2>

        <p
          className="mt-1 text-sm"
          style={{
            color: "var(--muted)",
          }}
        >
          {secret
            ? "This content will be protected and temporary."
            : "Enter the content you want to share."}
        </p>
      </div>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        rows={12}
        className="w-full resize-y rounded-2xl border p-4 text-sm outline-none"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg)",
          color: "var(--text)",
        }}
      />
    </div>
  );
}

export default CreateShare;