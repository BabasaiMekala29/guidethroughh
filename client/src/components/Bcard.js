import React from 'react';
import Chip from '@mui/material/Chip';
import { format } from 'date-fns';
import { Card, CardHeader, CardContent, CardActions, Avatar, Typography, MenuItem } from '@mui/material';
import { red } from '@mui/material/colors';
import { Link } from 'react-router-dom';

export default function BlogCard({ post }) {
  const words = post.description.split(/\s+/);
  const trimmedDescription = words.slice(0, 30).join(' ');
  const wordsCount = words.length;
  const averageReadingTime = Math.ceil(wordsCount / 200);

  const capitalizeFirstLetter = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <Link to={`/post/${post.category}/${post.subcategory}/${post.section}/${post._id}`} style={{ textDecoration: 'none', width: "80%" }}>
      <Card sx={{ marginBottom: '16px' }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }}>
              {post.author.username[0].toUpperCase()}
            </Avatar>
          }
          title={<span style={{ fontWeight: 'bold' }}>{post.author.username}</span>}
          subheader={format(new Date(post.createdAt), "dd-MMM-yyyy")}

        />
        <CardContent>
          {(post?.section === 'Blog') && <>
            <Typography variant='h6' color="text.primary" sx={{ fontSize: '24px', fontWeight: 'bold' }}>
              {capitalizeFirstLetter(post?.title)} &nbsp;
              <Chip label={`${averageReadingTime} min read`} size="small" sx={{ fontWeight: '500' }} />
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '16px' }}>
            {`${trimmedDescription}...`}
          </Typography>
          </>}
          {(post?.section !== 'Blog') && <>
            <Typography variant='h6' color="text.primary" sx={{ fontWeight: '600' }}>
            {`${trimmedDescription}...`}
          </Typography>
          </>}
          

        </CardContent>
        <CardActions disableSpacing>

        </CardActions>
      </Card>
    </Link>
  );
}
