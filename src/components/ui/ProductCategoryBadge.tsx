type CategoryBadgeProps = {
  name: string;
};

export function ProductCaregoryBadge({ name }: CategoryBadgeProps) {
  return (
    <div className="self-stretch flex justify-start items-start gap-2.5 flex-wrap content-start">
      <div className="px-2.5 py-1.5 bg-orange-50 rounded-md flex justify-center items-center gap-2.5">
        <div className="text-primary-800 text-sm font-medium leading-6">
          {name}
        </div>
      </div>
    </div>
  );
}
