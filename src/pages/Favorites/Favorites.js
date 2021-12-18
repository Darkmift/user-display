import React from "react";
import Text from "components/Text";
import UserList from "components/UserList";
import { usePeopleFetch } from "hooks";
import * as S from "./style";

const Favorites = () => {
  const { isLoading, countries, favorites, toggleCountry, toggleFavorite } = usePeopleFetch();

  return (
    <S.Home>
      <S.Content>
        <S.Header>
          <Text size="64px" bold>
            Favorites only
          </Text>
        </S.Header>
        <UserList
          users={countries.length ? favorites.filter(user => countries.includes(user.nat)) : favorites}
          isLoading={isLoading}
          countries={countries}
          toggleCountry={toggleCountry}
          toggleFavorite={toggleFavorite}
        />
      </S.Content>
    </S.Home>
  );
};

export default Favorites;
