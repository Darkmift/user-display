import React from "react";
import Text from "components/Text";
import UserList from "components/UserList";
import { usePeopleFetch } from "hooks";
import * as S from "./style";

const Home = () => {
  const { users, isLoading, countries, filteredList, toggleCountry, toggleFavorite } = usePeopleFetch();

  return (
    <S.Home>
      <S.Content>
        <S.Header>
          <Text size="64px" bold>
            PplFinder
          </Text>
        </S.Header>
        <UserList
          users={filteredList}
          isLoading={isLoading}
          countries={countries}
          toggleCountry={toggleCountry}
          toggleFavorite={toggleFavorite}
        />
      </S.Content>
    </S.Home>
  );
};

export default Home;
