
import React from "react";
import ShippingDateSelector from "@/components/logistics/ShippingDateSelector";
import { useLogisticsForm } from "@/hooks/useLogisticsForm";

const DateSection = () => {
  const {
    selectedDate,
    disabledDays,
    handleDateSelect,
    handleDatePopoverOpen,
    handleDateBlur,
    getFieldError
  } = useLogisticsForm();

  return (
    <ShippingDateSelector
      selectedDate={selectedDate}
      onDateSelect={handleDateSelect}
      onOpen={handleDatePopoverOpen}
      onBlur={handleDateBlur}
      disabledDays={disabledDays}
      error={getFieldError("shippingTime")}
    />
  );
};

export default DateSection;
