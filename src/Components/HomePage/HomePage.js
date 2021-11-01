import axios from "axios";
import React, { useEffect, useState } from "react";
import UseFetchApi from "../../Custom Hooks/UseFetchApi";
import classes from "./HomePage.module.css";
import AddPlayerPopupComponent from "../Popup/AddPlayerPopup";
import { Link } from "react-router-dom";

const apiURL = "http://localhost:8080/playerdata";
const teamApiURL = "http://localhost:8080/teamdata";

//mongodb+srv://pankajshree:<password>@cluster0.gv7jh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

export default function HomePage(props) {
  //const { apiResult, isLoading } = UseFetchApi(apiURL);

  const [playerData, setplayerData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [isTeamLoading, setisTeamLoading] = useState(true);
  const [isDataChanged, setisDataChanged] = useState(false);
  const [searchText, setsearchText] = useState("");
  const [teamData, setteamData] = useState([]);
  const [duplicateData, setduplicateData] = useState([]);

  //let duplicateTeamData = [];

  const fetchData = () => {
    axios
      .get(apiURL)
      .then((response) => {
        setplayerData(response.data);
        setisLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const searchByText = () => {
    const searchURL = `http://localhost:8080/playerdata/search/${searchText}`;
    searchText.toString().trim().length > 0 &&
      axios
        .get(searchURL)
        .then((result) => {
          setplayerData(result.data);
        })
        .catch((err) => {
          console.log(err);
        });
    if (searchText.toString().trim().length !== 0) {
      const newData = teamData.filter((item) =>
        item.key.toString().includes(searchText.toString().trim().toUpperCase())
      );
      setteamData(newData);
    } else {
      setteamData(duplicateData);
    }
  };

  const fetchTeamData = () => {
    axios
      .get(teamApiURL)
      .then((result) => {
        setteamData(result.data.data);
        setisTeamLoading(false);
        setduplicateData(result.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchData();
  }, [isDataChanged, searchText.toString().trim().length == 0]);

  useEffect(() => {
    searchByText();
  }, [searchText]);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const [isOpenIn, setisOpenIn] = useState(props.isOpen);
  const shareDataToComponentsIn = (isOpen) => {
    setisOpenIn(isOpen);
    props.shareDataToComponents(isOpen);
  };

  const handleSearchText = (e) => {
    const text = e.target.value;
    setsearchText(text);
  };

  return (
    <div className={classes.homePageWrapper}>
      <h1 className={classes.appHeading}>WELCOME TO CRICKET APP</h1>
      <div>
        {props.isOpen ? (
          <AddPlayerPopupComponent
            setisDataChanged={setisDataChanged}
            isDataChanged={isDataChanged}
            isOpen={isOpenIn}
            shareDataToComponents={shareDataToComponentsIn}
          />
        ) : (
          ""
        )}
      </div>
      {isLoading ? (
        <h1 className={classes.loadingText}>Loading...</h1>
      ) : (
        <div className={classes.landingPageWrapper}>
          <div className={classes.searchBarWrapper}>
            <input
              type="text"
              value={searchText}
              onChange={(e) => {
                handleSearchText(e);
              }}
            />
            <button>Search</button>
          </div>
          <h2 className={classes.availableTeamsText}>SHREE</h2>
          <div>
            {isTeamLoading ? (
              <h1 className={classes.loadingText}>Loading...</h1>
            ) : (
              <div className={classes.playerCardsWrapper}>
                {teamData.map((item, pos) => {
                  const {
                    fullName,
                    key,
                    championshipsWon,
                    teamIcon,
                    playerCount,
                    _id,
                  } = item;
                  return (
                    <Link
                      key={pos}
                      className={classes.playerCards}
                      to={`/team/${key}/${_id}`}
                    >
                      <div className={classes.teamLeftDiv}>
                        <img src={teamIcon} alt={fullName} />
                      </div>
                      <div className={classes.playerRightDiv}>
                        <h2>{fullName}</h2>
                        <h3>
                          Team: <span>{key}</span>
                        </h3>
                        <h3>
                          Playercount: <span>{playerCount}</span>
                        </h3>
                        <h3>
                          Championship Won: <span> {championshipsWon}</span>
                        </h3>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          <h2 className={classes.availableTeamsText}>Available Players</h2>
          <div className={classes.playerCardsWrapper}>
            {playerData.data.map((item, pos) => {
              const {
                description,
                from,
                isPlaying,
                playerName,
                price,
                _id,
                playerImage,
              } = item;
              return (
                <Link to={`/player/${_id}`} className={classes.playerCards}>
                  <div className={classes.playerLeftDiv}>
                    <img src={playerImage} alt={playerName} />
                  </div>
                  <div className={classes.playerRightDiv}>
                    <h2>{playerName}</h2>
                    <h3>
                      Team: <span>{from}</span>
                    </h3>
                    <h3>
                      Price: <span>{price} Cr.</span>
                    </h3>
                    <h3>
                      Status:{" "}
                      <span> {isPlaying ? "Playing" : "Not Playing"}</span>
                    </h3>
                    <h3>
                      Role: <span>{description}</span>{" "}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

