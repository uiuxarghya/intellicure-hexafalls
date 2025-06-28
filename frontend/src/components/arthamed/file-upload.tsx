"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileText, ImageIcon, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface FileUploadProps {
  onFileUpload: (files: File[]) => void
  isUploading: boolean
  acceptedTypes: Record<string, string[]>
  maxSize?: number
  maxFiles?: number
}

export function FileUpload({
  onFileUpload,
  isUploading,
  acceptedTypes,
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
}: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: unknown[]) => {
      if (rejectedFiles.length > 0) {
        console.log("Rejected files:", rejectedFiles)
      }

      if (acceptedFiles.length > 0) {
        // Simulate upload progress
        setUploadProgress(0)
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval)
              return 100
            }
            return prev + 10
          })
        }, 100)

        onFileUpload(acceptedFiles)
      }
    },
    [onFileUpload],
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    maxSize,
    maxFiles,
    disabled: isUploading,
  })

  const getIcon = () => {
    if (isDragActive && !isDragReject) {
      return <Upload className="w-12 h-12 text-blue-600 animate-bounce" />
    }
    if (isDragReject) {
      return <AlertCircle className="w-12 h-12 text-red-500" />
    }
    return <Upload className="w-12 h-12 text-gray-400" />
  }

  const getMessage = () => {
    if (isDragReject) {
      return "File type not supported"
    }
    if (isDragActive) {
      return "Drop your files here..."
    }
    return "Drag & drop your medical documents here"
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
          isDragActive && !isDragReject && "border-blue-500 bg-blue-50",
          isDragReject && "border-red-500 bg-red-50",
          !isDragActive && "border-gray-300 hover:border-gray-400 hover:bg-gray-50",
          isUploading && "pointer-events-none opacity-50",
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center space-y-4">
          {getIcon()}

          <div>
            <p className="text-lg font-medium text-gray-900 mb-2">{getMessage()}</p>
            <p className="text-sm text-gray-600 mb-4">or click to browse your files</p>

            <Button variant="outline" disabled={isUploading}>
              Choose Files
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <FileText className="w-3 h-3" />
              <span>PDF</span>
            </span>
            <span className="flex items-center space-x-1">
              <ImageIcon className="w-3 h-3" />
              <span>JPG</span>
            </span>
            <span className="flex items-center space-x-1">
              <ImageIcon className="w-3 h-3" />
              <span>PNG</span>
            </span>
            <span>• Max {maxSize / (1024 * 1024)}MB per file</span>
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading files...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
    </div>
  )
}
