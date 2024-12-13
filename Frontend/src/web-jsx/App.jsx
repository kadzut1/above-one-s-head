import React from "react";
import "../web-scss/App.scss";
import Header from "./Header";
import ProductSearch from "./ProductSearch";
import EventCategory from "./EventCategory";
import DateSelector from "./DateSelector";
import NavigationMenu from "./navigation";
import { Footer } from "./Footer";

function App() {
  return (
    <div className="app">
      <Header />
      <NavigationMenu />
      
      <main className="main-container">
        <header>
          <DateSelector />
        </header>
        
        <section className="product-search-section">
          <h2>Новогодний магазин</h2>
          <ProductSearch />
        </section>

        <section className="recommendations-section">
          <EventCategory title="Рекомендации" />
          <EventCategory />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
