import React from 'react';
import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { PHOTO_FRAGMENT } from '../fragments';
import useUser from '../hooks/useUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHeart } from '@fortawesome/free-regular-svg-icons';
import { FatText } from '../components/shared';
import styled from 'styled-components';
import Button from '../components/auth/Button';
import PageTitle from '../components/PageTitle';

const Header = styled.div`
  display: flex;
`;
const Avatar = styled.img`
  margin-left: 50px;
  height: 160px;
  width: 160px;
  border-radius: 50%;
  margin-right: 150px;
`;
const Column = styled.div``;
const Username = styled.h3`
  font-size: 28px;
  font-weight: 400;
`;
const Row = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  display: flex;
`;
const List = styled.ul`
  display: flex;
`;
const Item = styled.li`
  margin-right: 20px;
`;
const Value = styled(FatText)`
  font-size: 18px;
`;
const Name = styled(FatText)`
  font-size: 20px;
`;
const Grid = styled.div`
  display: grid;
  grid-auto-rows: 290px;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 50px;
`;
interface IPhoto {
  bgImg: string;
}
const Photo = styled.div<IPhoto>`
  background-image: url(${(props) => props.bgImg});
  background-size: cover;
  position: relative;
`;
const Icons = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  opacity: 0;
  &:hover {
    opacity: 1;
  }
`;
const Icon = styled.span`
  font-size: 18px;
  display: flex;
  align-items: center;
  margin: 0 5px;
  svg {
    font-size: 14px;
    margin-right: 5px;
  }
`;
const ProfileBtn = styled(Button).attrs({
  as: 'span',
})`
  margin-left: 20px;
  padding-left: 20px;
  padding-right: 20px;
  cursor: pointer;
`;

const SEE_PROFILE_QUERY = gql`
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      id
      firstName
      lastName
      username
      bio
      avatar
      photos {
        ...PhotoFragment
      }
      totalFollowing
      totalFollowers
      isMine
      isFollowing
    }
  }
  ${PHOTO_FRAGMENT}
`;

const FOLLOW_USER_MUTATION = gql`
  mutation followUser($username: String!) {
    followUser(username: $username) {
      status
      error
    }
  }
`;

const UNFOLLOW_USER_MUTATION = gql`
  mutation unfollowUser($username: String!) {
    unfollowUser(username: $username) {
      status
      error
    }
  }
`;

interface IProfile {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  avatar: string;
  photos: Array<{
    id: number;
    image: string;
    likes: number;
    isLiked: boolean;
    commentNumber: number;
  }>;
  totalFollowing: number;
  totalFollowers: number;
  isMine: boolean;
  isFollowing: boolean;
}

interface ISeeProfile {
  seeProfile: IProfile;
}

interface IParams {
  username: string;
}

const Profile: React.FC = () => {
  const { username } = useParams<IParams>();
  const { data: userData } = useUser();
  const client = useApolloClient();
  const { data, loading } = useQuery<ISeeProfile>(SEE_PROFILE_QUERY, {
    variables: {
      username,
    },
  });

  const [followUser] = useMutation(FOLLOW_USER_MUTATION, {
    variables: {
      username,
    },
    onCompleted: (data) => {
      const {
        followUser: { status },
      } = data;
      if (!status) return;
      const { cache } = client;
      cache.modify({
        id: `User:${username}`,
        fields: {
          isFollowing(prev) {
            return !prev;
          },
          totalFollowers(prev) {
            return prev + 1;
          },
        },
      });
      cache.modify({
        id: `User:${userData?.seeMe.username}`,
        fields: {
          totalFollowing(prev) {
            return prev + 1;
          },
        },
      });
    },
  });

  const [unfollowUser] = useMutation(UNFOLLOW_USER_MUTATION, {
    variables: {
      username,
    },
    update: (cache, result) => {
      const {
        data: {
          unfollowUser: { status },
        },
      } = result;
      if (!status) return;
      cache.modify({
        id: `User:${username}`,
        fields: {
          isFollowing(prev) {
            return !prev;
          },
          totalFollowers(prev) {
            return prev - 1;
          },
        },
      });

      cache.modify({
        id: `User:${userData?.seeMe.username}`,
        fields: {
          totalFollowing(prev) {
            return prev - 1;
          },
        },
      });
    },
  });

  const getButton = (seeProfile: IProfile) => {
    const { isMine, isFollowing } = seeProfile;
    if (isMine) return <ProfileBtn>Edit Profile</ProfileBtn>;
    else if (isFollowing)
      return <ProfileBtn onClick={() => unfollowUser()}>Unfollow</ProfileBtn>;
    else return <ProfileBtn onClick={() => followUser()}>Follow</ProfileBtn>;
  };

  return (
    <div>
      <PageTitle
        title={
          loading ? 'Loading...' : `${data?.seeProfile.username}'s Profile`
        }
      />
      <Header>
        <Avatar src={data ? data.seeProfile.avatar : ''} />
        <Column>
          <Row>
            <Username>{data?.seeProfile.username}</Username>
            {data?.seeProfile ? getButton(data.seeProfile) : null}
          </Row>
          <Row>
            <List>
              <Item>
                <span>
                  <Value>{data?.seeProfile.totalFollowers}</Value> followers
                </span>
              </Item>
              <Item>
                <span>
                  <Value>{data?.seeProfile.totalFollowing}</Value> following
                </span>
              </Item>
            </List>
          </Row>
          <Row>
            <Name>
              {data?.seeProfile.firstName}
              {'  '}
              {data?.seeProfile.lastName}
            </Name>
          </Row>
          <Row>{data?.seeProfile.bio}</Row>
        </Column>
      </Header>
      <Grid>
        {data?.seeProfile?.photos.map((photo) => (
          <Photo key={photo.id} bgImg={photo.image}>
            <Icons>
              <Icon>
                <FontAwesomeIcon icon={faHeart} />
                {photo.likes}
              </Icon>
              <Icon>
                <FontAwesomeIcon icon={faComment} />
                {photo.commentNumber}
              </Icon>
            </Icons>
          </Photo>
        ))}
      </Grid>
    </div>
  );
};

export default Profile;
