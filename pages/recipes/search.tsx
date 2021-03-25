import React, { FC, useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import { Links, Recipe, searchRecipes } from '../../lib/recipe';
import Button from '../../components/button/button';
import RecipeListNode from '../../components/recipe-list-node/recipe-list-node';
import Link from 'next/link';
import SearchBar from '../../components/SearchBar/search-bar';

const SearchResult: FC = () => {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [links, setLinks] = useState<Links>()
  const [searchResult, setSearchResult] = useState<boolean>(true);

  const keyword = String(router.query.keyword);

  useEffect(() => {
    (async () => {
      const result = await searchRecipes(keyword);
      setRecipes(result.recipes);
      setLinks(result.links);
      setLoading(true);
      if (Object.keys(result).includes('message')) {
        setSearchResult(false);
      }
    })();  
  }, [keyword]);

  const handleClick = (recipes: Recipe[], links: Links): void => {
    setRecipes(recipes);
    setLinks(links);
  };

  if (!loading) {
    return (
      <p>Loading...</p>
    );
  }

  return (
    <>
      <h1>
        <Link href='/recipes'>
          レピログ
        </Link>
      </h1>
      <SearchBar />
      {recipes && <RecipeListNode recipes={recipes}/>}
      {links?.prev &&
        <Button 
          buttonText='前のページ'
          link={links.prev}
          handleClick={handleClick}
        />
      }
      {links?.next &&
        <Button 
          buttonText='次のページ'
          link={links.next}
          handleClick={handleClick}
        />      
      }
      {!searchResult && <p>検索条件に一致するレシピは存在しません</p>}
    </>
  );
}

export default SearchResult;