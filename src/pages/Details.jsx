import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
const Details = () => {
  const [countryDetails, setCountryDetails] = useState(null);
console.log(countryDetails)
const {namee}=useParams()
console.log(namee)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${namee}`);
        const data = await response.json();
        setCountryDetails(data);
        
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  if (!countryDetails) {
    return <div>Loading...</div>;
  }

  const { flags, name, capital, region, subregion, population } = countryDetails[0];

  return (
    <div>
      <section className="countries">
        <div className="details">
          <img src={flags.svg} alt="Flag" />
          <h1>{name.common}</h1>
          <p>Capital: {capital}</p>
          <p>Region: {region}</p>
          <p>Subregion: {subregion}</p>
          <p>Population: {population}</p>
        </div>
      </section>
    </div>
  );
};

export default Details;
