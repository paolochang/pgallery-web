import { gql, useQuery } from '@apollo/client';
import { logUserOut } from '../apollo';
import Photo from '../components/feed/Photo';
import PageTitle from '../components/PageTitle';
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from '../fragments';
import {
  seeFeeds_seeFeeds_user,
  seeFeeds_seeFeeds_comments_user,
} from '../__generated__/seeFeeds';

const FEED_QUERY = gql`
  query seeFeeds {
    seeFeeds {
      ...PhotoFragment
      user {
        username
        avatar
      }
      caption
      comments {
        ...CommentFragment
      }
      createdAt
      isMine
    }
  }
  ${PHOTO_FRAGMENT}
  ${COMMENT_FRAGMENT}
`;

interface IFeed {
  id: number;
  user: seeFeeds_seeFeeds_user;
  image: string;
  isLiked: boolean;
  likes: number;
  caption: string;
  commentNumber: number;
  comments: Array<{
    id: number;
    user: seeFeeds_seeFeeds_comments_user;
    payload: string;
    isMine: boolean;
  }>;
}

interface IFeeds {
  seeFeeds: IFeed[];
}

const Home: React.FC = () => {
  const { data } = useQuery<IFeeds>(FEED_QUERY);
  //   const feed = data?.seeFeed;
  return (
    <>
      <PageTitle title="Home" />
      <div>
        {data &&
          data.seeFeeds?.map((photo) => (
            <Photo
              key={photo.id}
              id={photo.id}
              user={photo.user}
              image={photo.image}
              isLiked={photo.isLiked}
              likes={photo.likes}
              caption={photo.caption}
              commentNumber={photo.commentNumber}
              comments={photo.comments}
            />
          ))}
        <button onClick={() => logUserOut()}>Logout</button>
      </div>
    </>
  );
};
export default Home;
