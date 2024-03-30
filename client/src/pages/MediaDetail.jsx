import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { styled } from "@mui/material/styles";

import CircularRate from "../components/common/CircularRate";
import Container from "../components/common/Container";
import ImageHeader from "../components/common/ImageHeader";
import CastSlide from "../components/common/CastSlide";
import MediaVideosSlide from "../components/common/MediaVideosSlide";
import BackdropSlide from "../components/common/BackdropSlide";
import PosterSlide from "../components/common/PosterSlide";
import RecommendSlide from "../components/common/RecommendSlide";
import MediaSlide from "../components/common/MediaSlide";
import MediaReview from "../components/common/MediaReview";

import uiConfigs from "../configs/ui.configs";
import tmdbConfigs from "../api/configs/tmdb.configs";
import mediaApi from "../api/modules/media.api";
import favoriteApi from "../api/modules/favorite.api";

import { setGlobalLoading } from "../redux/features/globalLoadingSlice";
import { setAuthModalOpen } from "../redux/features/authModalSlice";
import { addFavorite, removeFavorite } from "../redux/features/userSlice";

const MediaDetailContainer = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  ...uiConfigs.style.mainContent,
}));

const MediaInfoBox = styled(Box)(({ theme }) => ({
  color: theme.palette.text.primary,
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}));

const MediaDetail = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { mediaType, mediaId } = useParams();
  const { user, listFavorites } = useSelector((state) => state.user);
  const [media, setMedia] = useState();
  const [isFavorite, setIsFavorite] = useState(false);
  const [onRequest, setOnRequest] = useState(false);
  const [genres, setGenres] = useState([]);
  const dispatch = useDispatch();
  const videoRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const getMedia = async () => {
      dispatch(setGlobalLoading(true));
      const { response, err } = await mediaApi.getDetail({ mediaType, mediaId });
      dispatch(setGlobalLoading(false));

      if (response) {
        setMedia(response);
        setIsFavorite(response.isFavorite);
        setGenres(response.genres.splice(0, 2));
      }

      if (err) toast.error(err.message);
    };

    getMedia();
  }, [mediaType, mediaId, dispatch]);

  const onFavoriteClick = async () => {
    if (!user) return dispatch(setAuthModalOpen(true));

    if (onRequest) return;

    if (isFavorite) {
      onRemoveFavorite();
      return;
    }

    setOnRequest(true);

    const body = {
      mediaId: media.id,
      mediaTitle: media.title || media.name,
      mediaType: mediaType,
      mediaPoster: media.poster_path,
      mediaRate: media.vote_average,
    };

    const { response, err } = await favoriteApi.add(body);

    setOnRequest(false);

    if (err) toast.error(err.message);
    if (response) {
      dispatch(addFavorite(response));
      setIsFavorite(true);
      toast.success("Added to favorites");
    }
  };

  const onRemoveFavorite = async () => {
    if (onRequest) return;
    setOnRequest(true);

    const favorite = listFavorites.find(
      (e) => e.mediaId.toString() === media.id.toString()
    );

    const { response, err } = await favoriteApi.remove({
      favoriteId: favorite.id,
    });

    setOnRequest(false);

    if (err) toast.error(err.message);
    if (response) {
      dispatch(removeFavorite(favorite));
      setIsFavorite(false);
      toast.success("Removed from favorites");
    }
  };

  return media ? (
    <>
      <ImageHeader
        imgPath={tmdbConfigs.backdropPath(media.backdrop_path || media.poster_path)}
      />
      <MediaDetailContainer>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundImage: `url(${tmdbConfigs.posterPath(
                  media.poster_path || media.backdrop_path
                )})`,
                paddingTop: "140%",
                position: "relative",
                borderRadius: theme.spacing(2),
                boxShadow: theme.shadows[3],
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MediaInfoBox>
              <Typography variant="h4" gutterBottom>
                {`${media.title || media.name} ${mediaType === tmdbConfigs.mediaType.movie
                    ? media.release_date.split("-")[0]
                    : media.first_air_date.split("-")[0]
                  }`}
              </Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <CircularRate value={media.vote_average} />
                <Divider sx={{ width: 1, mx: 2 }} orientation="vertical" />
                {genres.map((genre, index) => (
                  <Chip
                    key={index}
                    label={genre.name}
                    variant="filled"
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                ))}
              </Box>
              <Typography variant="body1" paragraph>
                {media.overview}
              </Typography>
              <Box display="flex" alignItems="center">
                <LoadingButton
                  variant="outlined"
                  startIcon={
                    isFavorite ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />
                  }
                  onClick={onFavoriteClick}
                  loading={onRequest}
                  sx={{ mr: 1 }}
                >
                  {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </LoadingButton>
                <Button
                  variant="contained"
                  startIcon={<PlayArrowIcon />}
                  onClick={() => videoRef.current.scrollIntoView({ behavior: "smooth" })}
                >
                  Watch Now
                </Button>
              </Box>
            </MediaInfoBox>
          </Grid>
        </Grid>
        <div ref={videoRef} style={{ paddingTop: theme.spacing(3) }}>
          <Container header="Videos">
            <MediaVideosSlide videos={[...media.videos.results].splice(0, 5)} />
          </Container>
        </div>
        {media.images.backdrops.length > 0 && (
          <Container header="Backdrops">
            <BackdropSlide backdrops={media.images.backdrops} />
          </Container>
        )}
        {media.images.posters.length > 0 && (
          <Container header="Posters">
            <PosterSlide posters={media.images.posters} />
          </Container>
        )}
        <MediaReview reviews={media.reviews} media={media} mediaType={mediaType} />
        <Container header="You May Also Like">
          {media.recommend.length > 0 && (
            <RecommendSlide medias={media.recommend} mediaType={mediaType} />
          )}
          {media.recommend.length === 0 && (
            <MediaSlide
              mediaType={mediaType}
              mediaCategory={tmdbConfigs.mediaCategory.top_rated}
            />
          )}
        </Container>
      </MediaDetailContainer>
    </>
  ) : null;
};

export default MediaDetail;
