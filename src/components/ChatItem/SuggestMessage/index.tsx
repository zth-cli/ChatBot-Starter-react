import { SuggestMessageItem } from './item'

interface SuggestMessageProps {
  loading?: React.ComponentType
  list?: string[]
  onClickSuggest?: (item: string) => void
}

export const SuggestMessage: React.FC<SuggestMessageProps> = ({
  loading: LoadingComponent,
  list = [],
  onClickSuggest
}) => {
  return (
    <div className="flex flex-col gap-2 w-full mt-6">
      {LoadingComponent && <LoadingComponent />}
      {list.map((item, index) => (
        <SuggestMessageItem key={index} content={item} onClick={() => onClickSuggest?.(item)} />
      ))}
    </div>
  )
}
