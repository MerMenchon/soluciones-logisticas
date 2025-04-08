
export interface LocationSelectorProps {
  type: "origin" | "destination" | "storage" | "transport";
  provinceValue: string;
  cityValue: string;
  onProvinceChange: (value: string) => void;
  onCityChange: (value: string, hasStorage: boolean) => void;
  label: string;
  useAsStorage?: boolean;
  onUseAsStorageChange?: (value: boolean) => void;
  estimatedTime?: string;
  onEstimatedTimeChange?: (value: string) => void;
  disableStorageOption?: boolean;
}

export interface UseLocationSelectHookParams {
  type: "origin" | "destination" | "storage" | "transport";
  provinceValue: string;
  cityValue: string;
  onCityChange: (value: string, hasStorage: boolean) => void;
}
