import { ExternalLink, FileText, Loader2, X } from "lucide-react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

const DocumentPreviewDialog = ({ document, preview, downloadUrl, loading, error, onClose }) => {
  if (!document && !loading) return null;

  const title = preview?.originalName || document?.originalName || document?.name || "Document preview";
  const previewUrl = preview?.previewUrl;
  const canInlinePdf = preview?.previewMode === "INLINE_PDF" && previewUrl;
  const canInlineImage = preview?.previewMode === "INLINE_IMAGE" && previewUrl;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <Card className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-extrabold">{title}</h2>
            <p className="mt-1 text-xs font-semibold text-muted-foreground">
              {preview?.contentType || document?.contentType || "Document"}
            </p>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close preview">
            <X size={18} />
          </Button>
        </div>

        <div className="min-h-[70vh] flex-1 bg-muted/40">
          {loading && (
            <div className="flex h-[70vh] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {!loading && error && (
            <div className="flex h-[70vh] flex-col items-center justify-center px-6 text-center">
              <FileText className="mb-4 text-muted-foreground" size={42} />
              <p className="text-sm font-bold text-destructive">{error}</p>
            </div>
          )}

          {!loading && !error && canInlinePdf && (
            <iframe
              title={title}
              src={previewUrl}
              className="h-[70vh] w-full border-0 bg-white"
            />
          )}

          {!loading && !error && canInlineImage && (
            <div className="flex h-[70vh] items-center justify-center overflow-auto p-4">
              <img src={previewUrl} alt={title} className="max-h-full max-w-full rounded-lg object-contain shadow-sm" />
            </div>
          )}

          {!loading && !error && !canInlinePdf && !canInlineImage && (
            <div className="flex h-[70vh] flex-col items-center justify-center px-6 text-center">
              <FileText className="mb-4 text-muted-foreground" size={48} />
              <h3 className="text-lg font-extrabold">Preview is not available for this file type</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                This document can be opened in a new tab or downloaded.
              </p>
              {(previewUrl || downloadUrl) && (
                <Button asChild className="mt-5">
                  <a href={previewUrl || downloadUrl} target="_blank" rel="noreferrer">
                    <ExternalLink size={16} /> Open document
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DocumentPreviewDialog;
