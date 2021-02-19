import React, { useState } from 'react';
import { doRateLimit } from '../../utils/fetchWrapper';
import './search.css';

export default function Search() {
    const [searchText, setSearchText] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const typeaHeadSearch = (e) => {
        setSearchText(e.target.value);
        setSearchResult([])
        if (e.target.value.length) {
            doRateLimit(`https://swapi.dev/api/planets/?search=${e.target.value}`).then((data) => {
                const { count, results } = data;
                if (count && results.length > 0) {
                    setSearchResult([...results]);
                }
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    const renderSuggestions = () => {
        let max = 0;
        searchResult.forEach(planet => {
            if (Number(planet.population) > max) {
                max = planet.population;
            }
        });
        console.log(max);
        return (
            <ul>
                {searchResult.map((item, index) => <li key={index} className={item.population === max ? 'large': ''}><span>{item.name}</span><span>{item.population}</span></li>)}
            </ul>
        )
    }
    return (
        <>
            <div>
                <input type="text" value={searchText} onChange={(e) => typeaHeadSearch(e)} placeholder='Search Planets' />
            </div>
            {searchResult.length > 0 && renderSuggestions()}
        </>
    )
}