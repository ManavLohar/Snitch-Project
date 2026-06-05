import React, { useEffect } from "react";
import { useProduct } from "../hook/useProduct";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { handleGetProducts } = useProduct();
  const { sellerProducts } = useSelector((state) => state.product);

  useEffect(() => {
    handleGetProducts();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#131313",
        color: "#e5e2e1",
        minHeight: "100vh",
        padding: "32px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <header style={{ marginBottom: "48px" }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "40px",
              fontWeight: "700",
              margin: "0 0 8px 0",
              color: "#e5e2e1",
            }}
          >
            Seller Dashboard
          </h1>
          <p style={{ color: "#d1c5ac", fontSize: "16px", margin: 0 }}>
            Manage your luxury inventory
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {sellerProducts && sellerProducts.length > 0 ? (
            sellerProducts.map((product) => (
              <div
                key={product._id}
                style={{
                  backgroundColor: "#1A1A1A",
                  borderRadius: "8px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <img
                  src={
                    product.images && product.images.length > 0
                      ? product.images[0].url
                      : "https://via.placeholder.com/300x400"
                  }
                  alt={product.title}
                  style={{ width: "100%", height: "300px", objectFit: "cover" }}
                />
                <div
                  style={{
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "24px",
                      fontWeight: "600",
                      margin: "0 0 8px 0",
                      color: "#e5e2e1",
                    }}
                  >
                    {product.title}
                  </h3>
                  <p
                    style={{
                      color: "#c6c6c7",
                      fontSize: "14px",
                      marginBottom: "24px",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      flexGrow: 1,
                    }}
                  >
                    {product.description}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "20px",
                        fontWeight: "600",
                        color: "#f5c518",
                      }}
                    >
                      {product.price?.currency === "INR"
                        ? "₹"
                        : product.price?.currency}
                      {product.price?.amount}
                    </span>
                    <button
                      style={{
                        backgroundColor: "#f5c518",
                        color: "#3d2f00",
                        border: "none",
                        borderRadius: "8px",
                        padding: "8px 24px",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#ffe5a0")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#f5c518")
                      }
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "#c6c6c7" }}>No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
