import React, { useState } from "react";
import { useQuery, useLazyQuery, gql, useMutation } from "@apollo/client";

const QUERY_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      name
      age
      username
      nationality
    }
  }
`;

const QUERY_ALL_MOVIES = gql`
  query GetAllMovies {
    movies {
      id
      name
      yearOfPublication
      isInTheaters
    }
  }
`;

const GET_MOVIE_BY_NAME = gql`
  query GetMovieByName($name: String!) {
    movie(name: $name) {
      name
      yearOfPublication
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      name
      id
    }
  }
`;

const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

export default function DisplayData() {
  const [movieSearched, setMovieSearched] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState(0);
  const [nationality, setNationality] = useState("");
  const [id, setID] = useState(0);
  const { data, loading, refetch } = useQuery(QUERY_ALL_USERS);
  const { data: movieData } = useQuery(QUERY_ALL_MOVIES);
  const [fetchMovie, { data: movieSearchedData, error: movieSearchedError }] =
    useLazyQuery(GET_MOVIE_BY_NAME);

  const [createUser] = useMutation(CREATE_USER_MUTATION);
  const [deleteUser] = useMutation(DELETE_USER_MUTATION);

  if (loading) {
    return <h1>Data is loading...</h1>;
  }

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Name..."
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Username..."
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          type="number"
          placeholder="Age..."
          onChange={(e) => {
            setAge(Number(e.target.value));
          }}
        />
        <input
          type="text"
          placeholder="Nationality..."
          onChange={(e) => {
            setNationality(e.target.value.toUpperCase());
          }}
        />
        <button
          onClick={() => {
            createUser({
              variables: { input: { name, username, age, nationality } },
            });
            refetch();
          }}
        >
          Create User
        </button>
      </div>
      <div>
        <input
          type="number"
          placeholder="Enter User ID"
          onChange={(e) => {
            setID(Number(e.target.value));
          }}
        />
        <button
          onClick={() => {
            deleteUser({
              variables: { id },
            });
            refetch();
          }}
        >
          Delete User By ID
        </button>
      </div>
      <div className="users">
        <h1>Users:</h1>
        {data &&
          data.users.map((user) => {
            return (
              <div className="user" key={user.id}>
                <h3>Name: {user.name}</h3>
                <h3>Username: {user.username}</h3>
                <h3>ID: {user.id}</h3>
                <h3>Age: {user.age}</h3>
                <h3>Nationality: {user.nationality}</h3>
              </div>
            );
          })}
      </div>
      <div className="movies">
        <h1>Movies:</h1>
        {movieData &&
          movieData.movies.map((movie) => {
            return (
              <div className="movie" key={movie.id}>
                <h3>Movie Name: {movie.name}</h3>
                <h3>
                  {movie.isInTheaters
                    ? "You can see the movie in theaters"
                    : "You can't see in theaters"}
                </h3>
                <h3>Year: {movie.yearOfPublication}</h3>
              </div>
            );
          })}
      </div>
      <div>
        <input
          type="text"
          placeholder="Interstellar..."
          onChange={(e) => setMovieSearched(e.target.value)}
        />
        <button
          onClick={() => {
            fetchMovie({ variables: { name: movieSearched } });
          }}
        >
          Fetch Data
        </button>
        <div>
          {movieSearchedData && (
            <div>
              <h3>Movie Name: {movieSearchedData.movie.name}</h3>
              <h3>
                Year Of Publication: {movieSearchedData.movie.yearOfPublication}
              </h3>
            </div>
          )}
          {movieSearchedError && <h3>There was an error fetching data</h3>}
        </div>
      </div>
    </>
  );
}
