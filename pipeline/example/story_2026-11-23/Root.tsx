import React from 'react';
import { Composition, Still } from 'remotion';
import { StoryVideo, StoryCover, DUR } from './Story';
import { W, H, FPS } from './lib';
export const RemotionRoot: React.FC = () => (<>
  <Composition id="Story" component={StoryVideo} width={W} height={H} fps={FPS} durationInFrames={Math.round(DUR * FPS)} />
  <Still id="Cover" component={StoryCover} width={W} height={H} />
</>);
