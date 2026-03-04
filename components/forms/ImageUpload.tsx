"use client";

import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { GripVertical, ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
// import { uploadImageToSanity } from "@/lib/sanity/upload";
import { cn } from "@/lib/utils";

export interface ImageItem {
  id: string;
  url: string;
  assetRef: string;
  isUploading?: boolean;
}
