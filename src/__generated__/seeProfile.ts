/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: seeProfile
// ====================================================

export interface seeProfile_seeProfile_photos {
  __typename: "Photo";
  id: number;
  image: string;
  likes: number;
  commentNumber: number;
  isLiked: boolean;
}

export interface seeProfile_seeProfile {
  __typename: "User";
  id: number;
  firstName: string;
  lastName: string | null;
  username: string;
  bio: string | null;
  avatar: string | null;
  photos: (seeProfile_seeProfile_photos | null)[] | null;
  totalFollowing: number;
  totalFollowers: number;
  isMine: boolean;
  isFollowing: boolean;
}

export interface seeProfile {
  seeProfile: seeProfile_seeProfile | null;
}

export interface seeProfileVariables {
  username: string;
}
