import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./App.css";

Modal.setAppElement("#root");

function App() {
  const [allCats, setAllCats] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedCat, setSelectedCat] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [basket, setBasket] = useState([]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleCatClick = (cat) => {
    setSelectedCat(cat);
    toggleModal();
  };

  const handleAddToBasket = () => {
    setBasket([...basket, selectedCat]);
    toggleModal();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.thecatapi.com/v1/images/search?limit=9"
        );

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = await response.json();

        console.log(data);
        setAllCats(data);
      } catch (err) {
        console.log(err);
        setErrorMessage("Data Not Found");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      <h1>Fetching Data</h1>
      {errorMessage && <h3>{errorMessage}</h3>}
      {loading && <p>Loading...</p>}
      {allCats.map((cat, index) => {
        if (index < 9) {
          return (
            <div className="return" key={index}>
              <img
                src={cat.url}
                alt={cat.id}
                onClick={() => handleCatClick(cat)}
              />
            </div>
          );
        }
      })}
      <Modal
        isOpen={showModal}
        onRequestClose={toggleModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            width: "33%",
            height: "66%",
            margin: "auto",
            borderRadius: "10px",
            boxShadow: "10px 5px 15px rgba(0,0,0,0.5)",
            backgroundSize: "cover",
          },
        }}
      >
        <div className="closeModal">
          <button onClick={toggleModal}>X</button>
        </div>
        {selectedCat && (
          <>
            <h2>{selectedCat.id}</h2>
            <div className="modalImage">
              <img src={selectedCat.url} alt={selectedCat.id} />
            </div>
            <button onClick={handleAddToBasket}>Add to Basket</button>
          </>
        )}
      </Modal>
      <div>
        <h2>Basket</h2>
        {basket.length === 0 && <p>The basket is empty</p>}
        {basket.map((cat) => (
          <div key={cat.id}>
            <h3>{cat.id}</h3>
            <img src={cat.url} alt={cat.id} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
