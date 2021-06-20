import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import Helmet from 'react-helmet';

const {
  REACT_APP_ARTICLE_LISTING_API_URL,
  REACT_APP_SECTION_LISTING_API_URL,
  REACT_APP_API_KEY,
} = process.env;

const News = ({ userDetails, setUser, setLoading }) => {
  const history = useHistory();
  const logout = () => {
    setUser({ name: '', email: '' });
    history.replace('/');
  };

  const [sections, setSections] = useState([]);
  const [articles, setArticles] = useState([]);
  const [selectedSection, setSection] = useState('all');
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [page, setPage] = useState(0);

  const getAndSetArticles = async (limit) => {
    setLoading(true);
    try {
      const params = { 'api-key': REACT_APP_API_KEY, offset: page * 10 };
      if (limit) {
        params.limit = limit;
      }
      const {
        data: { results },
      } = await axios.get(REACT_APP_ARTICLE_LISTING_API_URL, {
        params,
      });
      if (limit === 10) {
        setSelectedArticles(results);
      } else {
        setArticles(results);
      }
    } catch (error) {
      toast.error('Error occured while fetching articles from NY Times');
    }
    setLoading(false);
  };

  const getAndSetSections = async () => {
    setLoading(true);
    try {
      const {
        data: { results },
      } = await axios.get(REACT_APP_SECTION_LISTING_API_URL, {
        params: { 'api-key': REACT_APP_API_KEY },
      });
      results.unshift({ section: 'all', display_name: 'All' });
      setSections(results);
    } catch (error) {
      toast.error('Error occured while fetching sections from NY Times');
    }
    setLoading(false);
  };

  useEffect(() => {
    getAndSetSections();
    getAndSetArticles(500);
  }, []);

  useEffect(() => {
    if (selectedSection && selectedSection !== 'all') {
      const newArticles = articles.filter(
        (article) => article.section.toLowerCase() === selectedSection,
      );
      setSelectedArticles(newArticles);
      setPage(0);
    }
    if (selectedSection === 'all') {
      setSelectedArticles(articles);
    }
  }, [selectedSection, articles]);

  const numberOfPageBlocks = 10;
  const pageLimit = 10;

  useEffect(() => {
    if (selectedSection === 'all') {
      getAndSetArticles(10);
    }
  }, [page]);

  let shouldPaginate = articles && articles.length > pageLimit;
  let numberOfPages = Math.ceil(articles.length / numberOfPageBlocks);
  if (selectedSection !== 'all') {
    shouldPaginate = selectedArticles && selectedArticles.length > pageLimit;
    numberOfPages = Math.ceil(selectedArticles.length / numberOfPageBlocks);
  }

  return (
    <>
      <Helmet>
        <title>News</title>
      </Helmet>
      <div className="w-75 mb-5">
        <div className="alert alert-primary" role="alert">
          <h1>
            Hi&nbsp;
            {userDetails.name}
          </h1>
          <Link to="/profile" className="btn btn-primary mr-3 my-3">
            Edit Profile
          </Link>
          <button
            onClick={logout}
            type="button"
            className="btn btn-primary m-3"
          >
            Logout
          </button>
        </div>
        <div className="row">
          <section className="col-lg-3">
            <h2 className="alert alert-info">Sections</h2>
            <div className="list-group">
              {sections &&
                Array.isArray(sections) &&
                sections.map((section) => (
                  <a
                    key={section.section}
                    href="#/"
                    onClick={() => {
                      setSection(section.section);
                      window.scrollTo(0, 0);
                    }}
                    className={`list-group-item list-group-item-action ${
                      selectedSection === section.section ? 'active' : ''
                    }`}
                  >
                    {section.display_name}
                  </a>
                ))}
            </div>
          </section>
          <section className="col-lg-9">
            <h2 className="alert alert-info">Articles</h2>
            <div className="list-group">
              {selectedArticles &&
                Array.isArray(selectedArticles) &&
                selectedArticles
                  .filter(
                    (_, index) =>
                      (selectedSection === 'all' && index < 10) ||
                      (index >= page * pageLimit &&
                        index <= page * pageLimit + pageLimit - 1),
                  )
                  .map((article) => (
                    <div key={article.slug_name} className="card w-100 my-2">
                      <div className="card-body ">
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noreferrer"
                          className="list-group-item list-group-item-action border-0 row d-flex"
                        >
                          {article.thumbnail_standard && (
                            <div className="col-lg-4">
                              <img
                                src={article.thumbnail_standard}
                                className="card-img-top"
                                alt="Thumbnail"
                              />
                            </div>
                          )}

                          <div
                            className={`${
                              article.thumbnail_standard
                                ? 'col-lg-8'
                                : 'col-lg-12'
                            }`}
                          >
                            <h5 className="card-title">{article.title}</h5>
                            <p className="card-text">{article.abstract}</p>
                          </div>
                        </a>
                      </div>
                    </div>
                  ))}
              {selectedArticles &&
                Array.isArray(selectedArticles) &&
                selectedArticles.length === 0 && (
                  <div className="alert alert-danger">
                    <h1>
                      No articles for&nbsp;
                      {selectedSection}
                      &nbsp;found
                    </h1>
                  </div>
                )}
            </div>
            {shouldPaginate && (
              <div className="mt-3 text-center">
                {page !== 0 && (
                  <span
                    onClick={() => {
                      setPage(0);
                      window.scrollTo(0, 0);
                    }}
                    onKeyPress={() => {
                      setPage(0);
                      window.scrollTo(0, 0);
                    }}
                    role="button"
                    tabIndex={0}
                    className="border border-primary p-3 mx-1 btn btn-primary mb-3"
                  >
                    {'<<'}
                  </span>
                )}
                {page > 0 && numberOfPages >= numberOfPageBlocks && (
                  <span
                    onClick={() => {
                      setPage(
                        page < numberOfPageBlocks
                          ? page - 1
                          : page - numberOfPageBlocks,
                      );
                      window.scrollTo(0, 0);
                    }}
                    onKeyPress={() => {
                      setPage(
                        page < numberOfPageBlocks
                          ? page - 1
                          : page - numberOfPageBlocks,
                      );
                      window.scrollTo(0, 0);
                    }}
                    role="button"
                    tabIndex={0}
                    className="border border-primary p-3 mx-1 btn btn-primary mb-3"
                  >
                    {'<'}
                  </span>
                )}
                {Array.from({
                  length: numberOfPages,
                })
                  .map((_, index) => index)
                  .filter(
                    (index) =>
                      numberOfPages < numberOfPageBlocks ||
                      (page + numberOfPageBlocks > numberOfPages &&
                        index >= numberOfPages - numberOfPageBlocks) ||
                      (index >= page && index < page + numberOfPageBlocks),
                  )
                  .map((pageNumber) => (
                    <span
                      onClick={() => {
                        setPage(pageNumber);
                        window.scrollTo(0, 0);
                      }}
                      onKeyPress={() => {
                        setPage(pageNumber);
                        window.scrollTo(0, 0);
                      }}
                      role="button"
                      tabIndex={0}
                      className={`border border-primary p-3 mb-3 mx-1 btn ${
                        page === pageNumber ? 'btn-success' : 'btn-primary'
                      }`}
                    >
                      {pageNumber + 1}
                    </span>
                  ))}
                {page < numberOfPages - numberOfPageBlocks && (
                  <span
                    onClick={() => {
                      setPage(page + numberOfPageBlocks);
                      window.scrollTo(0, 0);
                    }}
                    onKeyPress={() => {
                      setPage(page + numberOfPageBlocks);
                      window.scrollTo(0, 0);
                    }}
                    role="button"
                    tabIndex={0}
                    className="border border-primary p-3 mx-1 btn btn-primary mb-3"
                  >
                    {'>'}
                  </span>
                )}
                {page !== numberOfPages - 1 && (
                  <span
                    onClick={() => {
                      setPage(numberOfPages - 1);
                      window.scrollTo(0, 0);
                    }}
                    onKeyPress={() => {
                      setPage(numberOfPages - 1);
                      window.scrollTo(0, 0);
                    }}
                    role="button"
                    tabIndex={0}
                    className="border border-primary p-3 mx-1 btn btn-primary  mb-3"
                  >
                    {'>>'}
                  </span>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default News;

News.propTypes = {
  userDetails: PropTypes.shape(PropTypes.object).isRequired,
  setUser: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};
