/* eslint-disable @next/next/no-img-element */
"use client"

import { FileText, ImageIcon, X, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  preview?: string
}

interface UploadedFilesProps {
  files: UploadedFile[]
  onRemoveFile: (fileId: string) => void
}

export function UploadedFiles({ files, onRemoveFile }: UploadedFilesProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <ImageIcon className="w-5 h-5 text-blue-600" />
    }
    return <FileText className="w-5 h-5 text-red-600" />
  }

  const getFileTypeLabel = (type: string) => {
    if (type === "application/pdf") return "PDF"
    if (type.startsWith("image/")) return type.split("/")[1].toUpperCase()
    return "Unknown"
  }

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-900">Uploaded Files ({files.length})</h3>

      <div className="space-y-2">
        {files.map((file) => (
          <Card key={file.id} className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {file.preview ? (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={file.preview || "/placeholder.svg"}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {getFileIcon(file.type)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {getFileTypeLabel(file.type)}
                      </Badge>
                      <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  {file.preview && (
                    <Button variant="ghost" size="sm" onClick={() => window.open(file.preview, "_blank")}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveFile(file.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
