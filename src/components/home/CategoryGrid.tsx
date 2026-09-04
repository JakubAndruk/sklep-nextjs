import Link from "next/link";
import { MouseIcon } from "../icons/categories/MouseIcon";
import { MonitorIcon } from "../icons/categories/MonitorIcon";
import { HeadphoneIcon } from "../icons/categories/HeadphoneIcon";
import { KeyboardIcon } from "../icons/categories/KeyboardIcon";
import { WebcamIcon } from "../icons/categories/WebcamIcon";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type CategoryGridProps = {
  categories: Category[];
};

const CATEGORY_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  mouse: MouseIcon,
  monitor: MonitorIcon,
  headphone: HeadphoneIcon,
  keyboard: KeyboardIcon,
  webcam: WebcamIcon,
};

function DefaultIcon({ className = "" }: { className?: string }) {
  return <div className={`bg-primary-300 rounded-full ${className}`} />;
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-8">
      <div className="text-neutral-900 text-3xl font-medium leading-10">
        Category
      </div>

      <div className="self-stretch grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-0 lg:justify-between">
        {categories.map((category) => {
          const Icon = CATEGORY_ICONS[category.slug] ?? DefaultIcon;

          return (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="w-full lg:w-56 h-48 p-3 bg-base-white rounded-md outline-1 outline-offset-[-1px] outline-gray-400 flex flex-col justify-center items-center gap-6 hover:outline-primary-500 transition-colors"
            >
              <Icon className="size-20 text-primary-500" />
              <div className="text-neutral-900 text-xl font-medium leading-8">
                {category.name}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
