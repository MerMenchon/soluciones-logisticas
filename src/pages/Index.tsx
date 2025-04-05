
import React from "react";
import LogisticsForm from "@/components/LogisticsForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="reference-form-title text-3xl font-bold text-gray-900 mb-3">
            Servicio de logística
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Seleccione el servicio que necesita para su mercadería
          </p>
        </header>

        <LogisticsForm />
      </div>
    </div>
  );
};

export default Index;
