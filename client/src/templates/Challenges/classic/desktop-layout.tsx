import { first } from 'lodash-es';
import React, { useState, ReactElement } from 'react';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import { sortChallengeFiles } from '../../../../../utils/sort-challengefiles';
import { challengeTypes } from '../../../../utils/challenge-types';
import {
  ChallengeFile,
  ChallengeFiles,
  ResizeProps
} from '../../../redux/prop-types';
import ActionRow from './action-row';

type Pane = { flex: number };

interface DesktopLayoutProps {
  block: string;
  challengeFiles: ChallengeFiles;
  challengeType: number;
  editor: ReactElement | null;
  hasEditableBoundaries: boolean;
  hasNotes: boolean;
  hasPreview: boolean;
  instructions: ReactElement;
  layoutState: {
    codePane: Pane;
    editorPane: Pane;
    instructionPane: Pane;
    notesPane: Pane;
    previewPane: Pane;
    testsPane: Pane;
  };
  notes: ReactElement;
  preview: ReactElement;
  resizeProps: ResizeProps;
  superBlock: string;
  testOutput: ReactElement;
}

const reflexProps = {
  propagateDimensions: true
};

const DesktopLayout = (props: DesktopLayoutProps): JSX.Element => {
  const [showNotes, setShowNotes] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showConsole, setShowConsole] = useState(false);
  const [showInstructions, setShowInstuctions] = useState(true);

  const togglePane = (pane: string): void => {
    switch (pane) {
      case 'showPreview':
        setShowPreview(!showPreview);
        break;
      case 'showConsole':
        setShowConsole(!showConsole);
        break;
      case 'showNotes':
        setShowNotes(!showNotes);
        break;
      case 'showInstructions':
        setShowInstuctions(!showInstructions);
        break;
      default:
        setShowInstuctions(false);
        setShowConsole(false);
        setShowPreview(false);
        setShowNotes(false);
    }
  };

  const getChallengeFile = () => {
    const { challengeFiles } = props;
    return first(sortChallengeFiles(challengeFiles) as ChallengeFile[]);
  };

  const {
    block,
    challengeType,
    resizeProps,
    instructions,
    editor,
    testOutput,
    hasNotes,
    hasPreview,
    layoutState,
    notes,
    preview,
    hasEditableBoundaries,
    superBlock
  } = props;

  const challengeFile = getChallengeFile();
  const projectBasedChallenge = hasEditableBoundaries;
  const isMultifileCertProject =
    challengeType === challengeTypes.multifileCertProject;
  const displayPreview =
    projectBasedChallenge || isMultifileCertProject
      ? showPreview && hasPreview
      : hasPreview;
  const displayNotes = projectBasedChallenge ? showNotes && hasNotes : false;
  const displayConsole =
    projectBasedChallenge || isMultifileCertProject ? showConsole : true;
  const {
    codePane,
    editorPane,
    instructionPane,
    notesPane,
    previewPane,
    testsPane
  } = layoutState;

  return (
    <div className='desktop-layout'>
      {(projectBasedChallenge || isMultifileCertProject) && (
        <ActionRow
          block={block}
          hasNotes={hasNotes}
          isMultifileCertProject={isMultifileCertProject}
          isProjectBasedChallenge={projectBasedChallenge}
          showConsole={showConsole}
          showNotes={showNotes}
          showInstructions={showInstructions}
          showPreview={showPreview}
          superBlock={superBlock}
          togglePane={togglePane}
        />
      )}
      <ReflexContainer orientation='vertical'>
        {!projectBasedChallenge && showInstructions && (
          <ReflexElement flex={instructionPane.flex} {...resizeProps}>
            {instructions}
          </ReflexElement>
        )}
        {!projectBasedChallenge && showInstructions && (
          <ReflexSplitter propagate={true} {...resizeProps} />
        )}

        <ReflexElement flex={editorPane.flex} {...resizeProps}>
          {challengeFile && (
            <ReflexContainer
              key={challengeFile.fileKey}
              orientation='horizontal'
            >
              <ReflexElement
                flex={codePane.flex}
                {...reflexProps}
                {...resizeProps}
              >
                {editor}
              </ReflexElement>
              {displayConsole && (
                <ReflexSplitter propagate={true} {...resizeProps} />
              )}
              {displayConsole && (
                <ReflexElement
                  flex={testsPane.flex}
                  {...reflexProps}
                  {...resizeProps}
                >
                  {testOutput}
                </ReflexElement>
              )}
            </ReflexContainer>
          )}
        </ReflexElement>
        {displayNotes && <ReflexSplitter propagate={true} {...resizeProps} />}
        {displayNotes && (
          <ReflexElement flex={notesPane.flex} {...resizeProps}>
            {notes}
          </ReflexElement>
        )}

        {displayPreview && <ReflexSplitter propagate={true} {...resizeProps} />}
        {displayPreview && (
          <ReflexElement flex={previewPane.flex} {...resizeProps}>
            {preview}
          </ReflexElement>
        )}
      </ReflexContainer>
    </div>
  );
};

DesktopLayout.displayName = 'DesktopLayout';

export default DesktopLayout;
