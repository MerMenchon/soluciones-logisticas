
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const ConfirmationMessage = () => {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center py-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="text-green-500 mb-6"
      >
        <CheckCircle size={60} strokeWidth={1.5} />
      </motion.div>
      
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 1.5 }}
        className="text-2xl font-semibold text-agri-primary mb-3 text-center"
      >
        ¡Solicitud enviada con éxito!
      </motion.h2>
    </div>
  );
};

export default ConfirmationMessage;
