"use client";

// import debounce from "lodash.debounce";
import { CheckCircle2, Loader2, MapPin, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface AddressResult {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  lat: number;
  lng: number;
  formattedAddress: string;
}
