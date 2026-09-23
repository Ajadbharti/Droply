import { useRef, useState } from "react";
import {
  KeyRound,
  QrCode,
  ArrowRight,
  ShieldCheck,
  ScanLine,
  X,
} from "lucide-react";

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

  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    // Only allow numbers
    const number = value.replace(/\D/g, "");

    if (!number) {
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);
      return;
    }

    const newCode = [...code];

    // If user pastes/moves multiple numbers
    if (number.length > 1) {
      const numbers = number.split("");

      numbers.forEach((num, offset) => {
        if (index + offset < 6) {
          newCode[index + offset] = num;
        }
      });

      setCode(newCode);

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

    // Move to next input
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

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
  };

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

    inputRefs.current[0]?.focus();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const shareCode = code.join("");

    if (shareCode.length !== 6) {
      setError(
        "Please enter the complete 6-digit share code."
      );
      return;
    }

    /*
      Backend API will be connected here later.

      Example future request:

      POST /api/share/join

      {
        code: shareCode
      }
    */

    alert(
      `Share code ${shareCode} will be checked by the backend.`
    );
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
        {/* Header */}

        <div className="text-center">
          <div
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{
              backgroundColor:
                "rgb(var(--primary) / 0.12)",
              color: "rgb(var(--primary))",
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
                  className="h-14 w-11 rounded-xl border text-center text-xl font-bold outline-none transition focus:ring-2 sm:h-16 sm:w-14 sm:text-2xl"
                  style={{
                    borderColor:
                      error
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
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 font-semibold text-white transition hover:opacity-90 active:scale-[0.99]"
              style={{
                backgroundColor:
                  "rgb(var(--primary))",
              }}
            >
              Access Share
              <ArrowRight size={19} />
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
              color: "rgb(var(--primary))",
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

export default JoinShare;