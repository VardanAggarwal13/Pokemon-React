import { useEffect, useState } from "react";
import "./index.css";
import { PokemonCards } from "./PokemonCards";
export const Pokemon = () => {
    const API = "https://pokeapi.co/api/v2/pokemon?limit=124";
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [search, setSearch] = useState("");
    const fetchPokemon = async () => {
        try {
            const res = await fetch(API);
            const data = await res.json();
            console.log(data);

            const detailedPokemonData = data.results.map(async (curPokemon) => {
                console.log(curPokemon.url);
                const response = await fetch(curPokemon.url);
                const finalData = await response.json();

                return finalData;
            })
            const detailedResponses = await Promise.all(detailedPokemonData);
            setPokemon(detailedResponses);
            console.log(detailedResponses);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            setError(error.message);
        }
    }
    useEffect(() => {
        fetchPokemon();
    }, [])

    // search functionality in our pokemon webpage
    const searchData = pokemon.filter((curPokemon) => curPokemon.name.toLowerCase().includes(search.toLowerCase()));

    if (loading) {
        return (
            <div>
                <h1>loading...</h1>
            </div>
        )
    }

    if (error) {
        return (
            <div>
                <h1>{error}</h1>
            </div>
        )
    }
    return (
        <>
            <section>
                <header>
                    <h1>Lets Catch Pokemon</h1>
                </header>
                <div className="pokemon-search">
                    <input type="text" placeholder="Search Pokemon" value={search}
                        onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div>
                    <div>
                        <ul className="cards">
                            {
                                searchData.map((curPokemon) => {
                                    return <PokemonCards key={curPokemon.id} pokemonData={curPokemon} />
                                })
                            }
                        </ul>
                    </div>
                </div>
            </section>
        </>
    )
}