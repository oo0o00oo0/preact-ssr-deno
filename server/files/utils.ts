import { join } from "@std/path/join";
import { getCurrentDir } from "../internal.ts";

export function getDirectoryContents() {
  const path = getCurrentDir();
  const files = [...Deno.readDirSync(path)].map((entry) => entry);
  // console.log("files", files);
  const resourceValidationReasons = validateImageResources();
  const names = files.map((file) => file.name);
  return { names, files, resourceValidationReasons };
}

// C:\Users\dsgnr\Documents\tests

export function validateImageResources(): string[] {
  const reasons: string[] = [];
  const currentDir = getCurrentDir();

  try {
    // Check if images.txt exists and has at least one line of data
    const imageListContent = Deno.readTextFileSync(
      join(currentDir, "images.txt"),
    );

    if (!imageListContent.trim()) {
      reasons.push("images.txt is empty or does not contain valid data.");
    }

    // Check if images folder exists and contains images
    const imageFolderContent = [
      ...Deno.readDirSync(join(currentDir, "images")),
    ];
    if (imageFolderContent.length === 0) {
      reasons.push("The images folder is empty.");
    }
  } catch (error: unknown) {
    if (error instanceof Deno.errors.NotFound) {
      reasons.push("Required file or directory not found.");
    } else {
      reasons.push("Error accessing resources: " + (error as Error).message);
    }
  }

  return reasons;
}

export function checkInitialFiles(files: {
  name: string;
  isDirectory: boolean;
}[]): string[] {
  let status = null;
  const resourceValidationReasons = validateImageResources();

  if (resourceValidationReasons.length > 0) {
    status = resourceValidationReasons;
  }

  const imageFolderContent = getImageFolderContent(files);

  const imageDataNames = getImageDataNames(files);

  const areSame = arraysContainSameStrings(imageDataNames, imageFolderContent);

  if (!areSame) {
    status = ["The image data names and image folder content do not match."];
  }

  status = status || ["OK"];

  return status;
}

export function getImageFolderContent(
  files: { name: string; isDirectory: boolean }[],
): string[] {
  const imageFolder = files.find(
    (file) => file.isDirectory && file.name === "images",
  );

  if (!imageFolder) {
    return [];
  }

  return [...Deno.readDirSync(join(getCurrentDir(), imageFolder.name))].map((
    entry,
  ) => entry.name);
}

export function getImageDataNames(
  files: { name: string; isDirectory: boolean }[],
): string[] {
  const imageList = files.find(
    (file) => !file.isDirectory && file.name === "images.txt",
  );

  if (!imageList) {
    return [];
  }

  const imageListContent = Deno.readTextFileSync(
    join(getCurrentDir(), imageList.name),
  );
  const imageListArray = imageListContent.split("\n");

  return imageListArray
    .map((data) => data.trim()) // Trim whitespace from each line
    .filter((data) => data.length > 0) // Remove empty lines
    .map((data) => {
      const parts = data.split(" ");
      return parts[parts.length - 1];
    })
    .filter((name): name is string => name !== undefined);
}

export function arraysContainSameStrings(
  arr1: string[],
  arr2: string[],
): boolean {
  // Sort both arrays
  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();

  // Compare lengths
  if (sortedArr1.length !== sortedArr2.length) {
    return false;
  }

  // Compare elements
  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }

  return true;
}
