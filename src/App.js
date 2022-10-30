import './App.css';
import { useState, useEffect } from 'react'
import AdComponent from './AdComponent';
function App() {
  const [inputText, setInputText] = useState("")
  const [ads, setAds] = useState([])
  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "text": inputText
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://127.0.0.1/api", requestOptions)
      .then(response => response.json())
      .then(result => {
        let random = []
     random = result.ads.map((value) =><div key={value._id}> <AdComponent  image={value.imageurl} description={value.description} headline={value.headline} primaryText={value.primaryText} url={value.url}></AdComponent></div>)
        setAds(random)
      })
      .catch(error => console.log('error', error));
  }, [inputText])
  return (
    <div className="App">
      <header className="App-header">
        <input type="text" onChange={(event) => {
          setInputText(event.target.value)
        }} />
      </header>
      <main>
      {ads}
      </main>
    </div>
  );
}
export default App;
