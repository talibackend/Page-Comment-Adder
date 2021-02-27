CREATE TABLE `comments` (
  `id` int(255) NOT NULL,
  `commenter_id` text NOT NULL,
  `commented_id` text NOT NULL,
  `comment` text NOT NULL,
  `time` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `comments`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;
COMMIT;
