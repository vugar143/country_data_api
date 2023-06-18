
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const Home = () => {
  const [countries, setCountries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');
  const [populationFilter, setPopulationFilter] = useState(false);
  const [europeFilter, setEuropeFilter] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);
  useEffect(() => {
    const storedBreadcrumb = localStorage.getItem('breadcrumb');
    if (storedBreadcrumb) {
      setBreadcrumb(JSON.parse(storedBreadcrumb));
    }
  }, []);

  const handleRowClick = (index, countryName) => {
    setSelectedRow(index);
    setBreadcrumb((prevBreadcrumb) => [...prevBreadcrumb, countryName]);
  
    // Open details page in a new tab
    window.open(`/details/${countryName}`, '_blank');
  };
  const clearBreadcrumb = () => {
    setSelectedRow(null);
    setBreadcrumb([]);
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = () => {
    fetch('https://restcountries.com/v3.1/all')
      .then((response) => response.json())
      .then((data) => setCountries(data))
      .catch((error) => console.error(error));
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePopulationFilter = (event) => {
    setPopulationFilter(event.target.checked);
  };

  const handleEuropeFilter = (event) => {
    setEuropeFilter(event.target.checked);
  };

  const handleClick = (countryName) => {
    window.open(`/details/${countryName}`, '_blank');
    localStorage.setItem(
        'breadcrumb',
        JSON.stringify([...breadcrumb, countryName])
      );
  };

  // Apply filters and search term to the countries list
  let filteredCountries = countries;
  if (populationFilter) {
    filteredCountries = filteredCountries.filter(
      (country) => country.population < 500000
    );
  }
  if (europeFilter) {
    filteredCountries = filteredCountries.filter(
      (country) => country.region === 'Europe'
    );
  }
  if (searchTerm) {
    filteredCountries = filteredCountries.filter((country) =>
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCountries.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalItems = filteredCountries.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div>
      <div className="pgsr">
        <input
          className="search"
          type="text"
          placeholder="Search country by name..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <ul id="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <li
              key={index + 1}
              onClick={() => handlePageClick(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </li>
          ))}
        </ul>
      </div>
      <div className="checkbox">
        <div className="check-lay">
        <label htmlFor="population">Population less than 500,000</label>
        <input
          type="checkbox"
          id="population"
          checked={populationFilter}
          onChange={handlePopulationFilter}
        />
        </div>
        <div className="check-lay">
        <label className="avropa" htmlFor="europe">
          Countries in Europe
        </label>
        <input
          className="avropa"
          type="checkbox"
          id="europe"
          checked={europeFilter}
          onChange={handleEuropeFilter}
        />
        </div>
      </div>
      <nav className='breadcrumb'>
        <ol>
          <li>
            <Link to="/">Home</Link>
          </li>
          {breadcrumb.map((item, index) => (
            <li key={index}>
              {/* Update the Link to navigate to the details page */}
              <Link onClick={() => handleClick(item)}>{item}</Link>


            </li>
          ))}
        </ol>
        <button onClick={clearBreadcrumb}>Clear Breadcrumb</button>
      </nav>
      
      <table>
        <caption>Country Table</caption>
        <thead>
          <tr>
            <th>#</th>
            <th>Country Name</th>
            <th>Capital</th>
            <th>Region</th>
            <th>Subregion</th>
            <th>Population</th>
            <th>Flag</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((country, index) => (
           <tr
           key={index}
           onClick={(event) => {
             event.stopPropagation();
             handleRowClick(index, country.name.common);
           }}
           className={selectedRow === index ? 'selected' : ''}
         >
           <td>{indexOfFirstItem + index + 1}</td>
           <td>{country.name.common}</td>
           <td>{country.capital}</td>
           <td>{country.region}</td>
           <td>{country.subregion}</td>
           <td>{country.population}</td>
           <td>
             <img className="flag_img" src={country.flags.png} alt="Flag" />
           </td>
         </tr>
          ))}
        </tbody>
      </table>
     
    </div>
  );
};

export default Home;
