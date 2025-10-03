import React, { useState, useEffect } from 'react';
import Quagga from 'quagga'; // npm install quagga

export default function Inventory({ api }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, category: '', barcode: '' });

  // Fetch inventory
  useEffect(() => {
    fetch(`${api}/inventory`).then(res => res.json()).then(setItems);
  }, [api]);

  // Add item
  const addItem = async () => {
    const res = await fetch(`${api}/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    });
    const item = await res.json();
    setItems([...items, item]);
    setNewItem({ name: '', quantity: 1, category: '', barcode: '' });
  };

  // Barcode scanner
  const startScanner = () => {
    Quagga.init({
      inputStream: { type: "LiveStream", target: document.querySelector('#scanner') },
      decoder: { readers: ["ean_reader"] }
    }, err => { if (err) console.log(err); else Quagga.start(); });

    Quagga.onDetected(result => {
      setNewItem(prev => ({ ...prev, barcode: result.codeResult.code }));
      Quagga.stop();
    });
  };

  return (
    <div>
      <h2>Inventory</h2>
      <input placeholder="Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
      <input type="number" placeholder="Qty" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: e.target.value})} />
      <input placeholder="Category" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} />
      <input placeholder="Barcode" value={newItem.barcode} readOnly />
      <button onClick={addItem}>Add Item</button>
      <button onClick={startScanner}>Scan Barcode</button>
      <div id="scanner" style={{ width: '400px', height: '300px' }}></div>

      <table>
        <thead><tr><th>Name</th><th>Qty</th><th>Category</th><th>Barcode</th></tr></thead>
        <tbody>
          {items.map(i => <tr key={i._id}><td>{i.name}</td><td>{i.quantity}</td><td>{i.category}</td><td>{i.barcode}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}
