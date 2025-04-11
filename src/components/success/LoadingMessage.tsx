
import React from "react";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";

const LoadingMessage = () => {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center py-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-agri-primary mb-6"
      >
        <Loader size={60} strokeWidth={1.5} className="animate-spin" />
      </motion.div>
      
      <div className="text-center text-lg text-gray-600">
        Estamos enviando su consulta...
      </div>
    </div>
  );
};

export default LoadingMessage;
