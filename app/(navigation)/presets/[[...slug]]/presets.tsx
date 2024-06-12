"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { useSectionInView, useSectionInViewObserver } from "@/utils/useSectionInViewObserver";

import styles from "./presets.module.css";
import { ScrollArea } from "../components/ScrollArea";
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/Tooltip";
import { Info01Icon, StarsIcon } from "@raycast/icons";
import { PresetComponent } from "../components/Preset";
import { Category, categories } from "../presets";
import { AiModel } from "../api";
import Link from "next/link";
import { ToastViewport } from "../components/Toast";

type Props = {
  models: AiModel[];
};

export default function Presets({ models }: Props) {
  const [enableViewObserver, setEnableViewObserver] = React.useState(false);
  useSectionInViewObserver({ headerHeight: 50, enabled: enableViewObserver, basePath: "/presets" });

  const [showAdvancedModels, setShowAdvancedModels] = React.useState(true);

  const advancedModels = models.filter((model) => model.requires_better_ai).map((model) => model.model);

  const filteredCategories = React.useMemo(() => {
    if (showAdvancedModels) {
      return categories;
    } else {
      return categories
        .map((category) => ({
          ...category,
          presets: category.presets.filter((preset) => {
            const presetObj = models.find((model) => model.id === preset.model);
            return !advancedModels.includes(presetObj?.model || "");
          }),
        }))
        .filter((category) => category.presets.length > 0);
    }
  }, [showAdvancedModels, advancedModels, models]);

  React.useEffect(() => {
    setEnableViewObserver(true);
  }, []);

  const pageTitle = "Preset Explorer by Raycast";
  const pageDescription = "Easily browse, share, and add presets to Raycast.";

  return (
    <>
      <div className={styles.main}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarInner}>
            <ScrollArea>
              <div className={styles.sidebarContent}>
                <div className={styles.sidebarNav}>
                  <p className={styles.sidebarTitle}>Categories</p>

                  {categories.map((category) => (
                    <NavItem
                      key={category.slug}
                      category={category}
                      disabled={!filteredCategories.some((filteredCategory) => filteredCategory.slug === category.slug)}
                    />
                  ))}
                </div>
                <span className={styles.sidebarNavDivider}></span>
                <div className={styles.sidebarNav}>
                  <div className={styles.filter}>
                    <span className={styles.label}>
                      <label htmlFor="advancedModels">Show Advanced AI Models</label>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info01Icon />
                        </TooltipTrigger>
                        <TooltipContent>Requires Advanced AI add-on to Raycast Pro</TooltipContent>
                      </Tooltip>
                    </span>

                    <input
                      id="advancedModels"
                      type="checkbox"
                      min={0}
                      checked={showAdvancedModels}
                      onChange={(e) => setShowAdvancedModels(e.target.checked)}
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className={styles.container}>
          {filteredCategories.map((category) => {
            return (
              <div
                key={category.name}
                data-section-slug={category.slug}
                style={{
                  outline: "none",
                }}
                tabIndex={-1}
              >
                <h2 className={styles.subtitle}>
                  <category.iconComponent /> {category.name}
                </h2>
                <div className={styles.presets}>
                  {category.presets.map((preset) => (
                    <PresetComponent key={preset.id} preset={preset} models={models} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <ToastViewport />
    </>
  );
}

function NavItem({ category, disabled }: { category: Category; disabled: boolean }) {
  const activeSection = useSectionInView();

  return (
    <Link
      href={`/presets${category.slug}`}
      shallow
      className={cn(styles.sidebarNavItem, disabled && styles.disabled)}
      data-active={activeSection === category.slug}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      {category.icon ? <category.iconComponent /> : <StarsIcon />}

      {category.name}
      <span className={styles.badge}>{category.presets.length}</span>
    </Link>
  );
}
