import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddOrder from "./AddOrder";
import ListOrders from "./ListOrders";
import DeleteOrder from "./DeleteOrder";

type OrderView = "list" | "add" | "delete" | "update";

const OrderManager: React.FC = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<OrderView>("list");

  const renderActiveView = () => {
    switch (activeView) {
      case "add":
        return <AddOrder onSuccess={() => setActiveView('list')} />;
      case "delete":
        return (
          <DeleteOrder/>
        );
      case "update":
        return (
          <div style={{ padding: "2rem" }}>
            Update Order Component - Coming Soon
          </div>
        );
      default:
        return <ListOrders />;
    }
  };

  return (
    <div>
      {/* Navigation Bar */}
      <div
        style={{
          padding: "1rem",
          borderBottom: "2px solid #dee2e6",
          backgroundColor: "#f8f9fa",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>📋 Order Management</h1>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Back to Dashboard
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginTop: "1rem",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setActiveView("list")}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: activeView === "list" ? "#007bff" : "#e9ecef",
              color: activeView === "list" ? "white" : "#495057",
              border: "1px solid #dee2e6",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            List Orders
          </button>

          <button
            onClick={() => setActiveView("add")}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: activeView === "add" ? "#007bff" : "#e9ecef",
              color: activeView === "add" ? "white" : "#495057",
              border: "1px solid #dee2e6",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Add Order
          </button>

          <button
            onClick={() => setActiveView("update")}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: activeView === "update" ? "#007bff" : "#e9ecef",
              color: activeView === "update" ? "white" : "#495057",
              border: "1px solid #dee2e6",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Update Order
          </button>

          <button
            onClick={() => setActiveView("delete")}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: activeView === "delete" ? "#007bff" : "#e9ecef",
              color: activeView === "delete" ? "white" : "#495057",
              border: "1px solid #dee2e6",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Delete Order
          </button>
        </div>
      </div>

      {/* Active View Content */}
      <div>{renderActiveView()}</div>
    </div>
  );
};

export default OrderManager;
