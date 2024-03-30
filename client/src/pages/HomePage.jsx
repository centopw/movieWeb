import React from 'react';
import { Box, Grid, Typography, useMediaQuery, styled } from '@mui/material';
import tmdbConfigs from '../api/configs/tmdb.configs';
import HeroSlide from '../components/common/HeroSlide';
import MediaSlide from '../components/common/MediaSlide';

const RootContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  padding: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const SectionContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(8),
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(4),
  },
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.palette.background.default,
    filter: 'blur(10px)',
    zIndex: -1,
  },
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  textTransform: 'uppercase',
  color: theme.palette.text.primary,
  textShadow: `2px 2px 4px ${theme.palette.background.default}`,
}));

const HomePage = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <RootContainer>
      <HeroSlide
        mediaType={tmdbConfigs.mediaType.movie}
        mediaCategory={tmdbConfigs.mediaCategory.popular}
      />
      <SectionContainer>
        <Grid container spacing={isMobile ? 2 : 4}>
          <Grid item xs={12} sm={6}>
            <SectionHeader variant="h5">🎬 Popular Movies</SectionHeader>
            <MediaSlide
              mediaType={tmdbConfigs.mediaType.movie}
              mediaCategory={tmdbConfigs.mediaCategory.popular}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SectionHeader variant="h5">📺 Popular Series</SectionHeader>
            <MediaSlide
              mediaType={tmdbConfigs.mediaType.tv}
              mediaCategory={tmdbConfigs.mediaCategory.popular}
            />
          </Grid>
        </Grid>
      </SectionContainer>
      <SectionContainer>
        <Grid container spacing={isMobile ? 2 : 4}>
          <Grid item xs={12} sm={6}>
            <SectionHeader variant="h5">🌟 Top Rated Movies</SectionHeader>
            <MediaSlide
              mediaType={tmdbConfigs.mediaType.movie}
              mediaCategory={tmdbConfigs.mediaCategory.top_rated}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SectionHeader variant="h5">🌟 Top Rated Series</SectionHeader>
            <MediaSlide
              mediaType={tmdbConfigs.mediaType.tv}
              mediaCategory={tmdbConfigs.mediaCategory.top_rated}
            />
          </Grid>
        </Grid>
      </SectionContainer>
    </RootContainer>
  );
};

export default HomePage;
