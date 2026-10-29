import React from 'react';
import { Composition, Still } from 'remotion';
import { WallVideo, WallCover } from './Wall';
import { W, H, FPS, END } from './lib';

export const RemotionRoot: React.FC = () => (
  <>
  <Composition id="Wall" component={WallVideo} width={W} height={H} fps={FPS} durationInFrames={Math.ceil(END * FPS)} />
  <Still id="Cover" component={WallCover} width={W} height={H} />
  </>
);
