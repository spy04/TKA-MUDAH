"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, FileWarning, LoaderCircle } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "react-pdf/node_modules/pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type PreviewMaterialViewerProps = {
  title: string;
  type: "VIDEO" | "PDF" | "SLIDE" | "DOCUMENT";
  fileUrl: string | null;
};

type ResolvedVideoSource =
  | {
      kind: "embed";
      src: string;
      provider: string;
    }
  | {
      kind: "file";
      src: string;
    };

function resolveYoutubeEmbedUrl(url: URL) {
  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");

  if (hostname === "youtu.be") {
    const videoId = url.pathname.split("/").filter(Boolean)[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }

  if (!hostname.endsWith("youtube.com")) {
    return null;
  }

  const videoIdFromQuery = url.searchParams.get("v");

  if (videoIdFromQuery) {
    return `https://www.youtube.com/embed/${videoIdFromQuery}`;
  }

  const pathSegments = url.pathname.split("/").filter(Boolean);
  const embedIndex = pathSegments.findIndex((segment) => segment === "embed" || segment === "shorts");
  const videoId = embedIndex >= 0 ? pathSegments[embedIndex + 1] : null;

  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

function resolveGoogleDrivePreviewUrl(url: URL) {
  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");

  if (hostname !== "drive.google.com" && hostname !== "docs.google.com") {
    return null;
  }

  const pathMatch = url.pathname.match(/\/file\/d\/([^/]+)/i);
  const fileId = pathMatch?.[1] || url.searchParams.get("id");

  return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : null;
}

function resolveVideoSource(fileUrl: string): ResolvedVideoSource {
  try {
    const url = new URL(fileUrl);
    const youtubeEmbedUrl = resolveYoutubeEmbedUrl(url);

    if (youtubeEmbedUrl) {
      return {
        kind: "embed",
        src: youtubeEmbedUrl,
        provider: "YouTube",
      };
    }

    const drivePreviewUrl = resolveGoogleDrivePreviewUrl(url);

    if (drivePreviewUrl) {
      return {
        kind: "embed",
        src: drivePreviewUrl,
        provider: "Google Drive",
      };
    }
  } catch {
    return {
      kind: "file",
      src: fileUrl,
    };
  }

  return {
    kind: "file",
    src: fileUrl,
  };
}

function useContainerWidth() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(720);

  useEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    const updateWidth = () => {
      setWidth(Math.max(280, Math.floor(element.clientWidth - 32)));
    };

    updateWidth();

    const observer = new ResizeObserver(() => {
      updateWidth();
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return { containerRef, width };
}

export function PreviewMaterialViewer({
  title,
  type,
  fileUrl,
}: PreviewMaterialViewerProps) {
  const { containerRef, width } = useContainerWidth();
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [loadError, setLoadError] = useState<string | null>(null);

  const isPdfLike = type === "PDF" || type === "SLIDE" || type === "DOCUMENT";
  const canGoPrev = pageNumber > 1;
  const canGoNext = pageNumber < numPages;
  const pdfFile = useMemo(() => {
    if (!fileUrl) {
      return null;
    }

    return fileUrl;
  }, [fileUrl]);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  if (!fileUrl) {
    return (
      <div className="rounded-[20px] border border-dashed border-[#d8e2f3] bg-[#f8fbff] px-6 py-10 text-center text-[15px] text-[#596983]">
        File untuk materi <span className="font-bold text-[#1f2f46]">{title}</span> belum tersedia.
      </div>
    );
  }

  if (type === "VIDEO") {
    const videoSource = resolveVideoSource(fileUrl);

    return (
      <div
        className="overflow-hidden rounded-[20px] border border-[#d8e2f3] bg-[#0f172a] shadow-[0_24px_44px_-30px_rgba(15,23,42,0.48)]"
        onContextMenu={handleContextMenu}
      >
        {videoSource.kind === "embed" ? (
          <div className="space-y-3 bg-[#0f172a] p-3">
            <iframe
              src={videoSource.src}
              title={`${title} - ${videoSource.provider}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="aspect-video w-full rounded-[16px] border border-white/10 bg-black"
              referrerPolicy="strict-origin-when-cross-origin"
            />
            <div className="px-1 pb-1 text-sm text-slate-300">
              Sumber video: {videoSource.provider}
            </div>
          </div>
        ) : (
          <video
            src={videoSource.src}
            controls
            controlsList="nodownload noplaybackrate noremoteplayback"
            disablePictureInPicture
            className="aspect-video w-full bg-black"
            onContextMenu={handleContextMenu}
          />
        )}
      </div>
    );
  }

  if (isPdfLike) {
    return (
      <div
        ref={containerRef}
        className="rounded-[20px] border border-[#d8e2f3] bg-white shadow-[0_24px_44px_-30px_rgba(15,23,42,0.32)]"
        onContextMenu={handleContextMenu}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e7edf8] px-4 py-4">
          <div>
            <p className="text-[15px] font-bold text-[#1f2f46]">{title}</p>
            <p className="mt-1 text-[13px] text-[#73829b]">
              {numPages > 0 ? `Halaman ${pageNumber} dari ${numPages}` : "Menyiapkan dokumen..."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPageNumber((current) => Math.max(1, current - 1))}
              disabled={!canGoPrev}
              className="flex h-10 items-center gap-2 rounded-[12px] border border-[#d8e2f3] px-3 text-[13px] font-bold text-[#1f2f46] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <ChevronLeft className="size-4" />
              Prev
            </button>
            <button
              type="button"
              onClick={() => setPageNumber((current) => Math.min(numPages, current + 1))}
              disabled={!canGoNext}
              className="flex h-10 items-center gap-2 rounded-[12px] bg-[#2563eb] px-3 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-45"
            >
              Next
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="min-h-[420px] bg-[#f8fbff] p-4">
          <Document
            file={pdfFile}
            loading={
              <div className="flex min-h-[360px] items-center justify-center gap-3 text-[#596983]">
                <LoaderCircle className="size-5 animate-spin" />
                Memuat dokumen...
              </div>
            }
            onLoadError={(error) => {
              setLoadError(error.message);
            }}
            onLoadSuccess={({ numPages: loadedPages }) => {
              setLoadError(null);
              setNumPages(loadedPages);
              setPageNumber(1);
            }}
          >
            <Page
              pageNumber={pageNumber}
              width={width}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Document>

          {loadError ? (
            <div className="mt-4 flex items-center gap-3 rounded-[16px] border border-[#f5d0d0] bg-[#fff5f5] px-4 py-4 text-[14px] text-[#b91c1c]">
              <FileWarning className="size-5 shrink-0" />
              Dokumen gagal dibuka di viewer. Detail: {loadError}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[20px] border border-dashed border-[#d8e2f3] bg-[#f8fbff] px-6 py-10 text-center text-[15px] text-[#596983]">
      Format materi ini belum punya viewer khusus.
    </div>
  );
}
